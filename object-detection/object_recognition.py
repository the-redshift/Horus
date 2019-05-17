import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import cv2
import requests

from collections import defaultdict
from threading import Lock
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util

class ObjectRecognition:
    def __init__(self, id, recognition_threshold, video_path, path_to_labels, class_subset=None):
        self.lock = Lock()
        self.id = id
        self.STOP = False
        self.MODEL_NAME = 'ssd_inception_v2_coco_2017_11_17'
        self.RECOGNITION_THRESHOLD = recognition_threshold
        self.VIDEO_PATH = video_path
        self.NUM_CLASSES = 90
        self.PATH_TO_LABELS = path_to_labels
        self.CLASS_SUBSET = class_subset

        # Initialize video stream
        #self.camera = cv2.VideoCapture(0) # WebCam
        self.camera = cv2.VideoCapture(self.VIDEO_PATH)

        # Set up model
        self.detection_graph = self._initialize_tensorflow_model()

        # Initialize labels
        self.category_index = self._initialize_labels();

    def _initialize_tensorflow_model(self):
        PATH_TO_CKPT = self.MODEL_NAME + '/frozen_inference_graph.pb'
        MODEL_FILE = self.MODEL_NAME + '.tar.gz'
        DOWNLOAD_BASE = 'http://download.tensorflow.org/models/object_detection/'

        exists = os.path.isfile(MODEL_FILE)
        if exists is False:
            opener = urllib.request.URLopener()
            opener.retrieve(DOWNLOAD_BASE + MODEL_FILE, MODEL_FILE)

        tar_file = tarfile.open(MODEL_FILE)
        for file in tar_file.getmembers():
            file_name = os.path.basename(file.name)
            if 'frozen_inference_graph.pb' in file_name:
                tar_file.extract(file, os.getcwd())

        detection_graph = tf.Graph()
        with detection_graph.as_default():
            od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def, name='')

        return detection_graph

    def _initialize_labels(self):
        label_map = label_map_util.load_labelmap(self.PATH_TO_LABELS)
        categories = label_map_util.convert_label_map_to_categories(
            label_map, max_num_classes=self.NUM_CLASSES, use_display_name=True)
        category_index = label_map_util.create_category_index(categories)

        return category_index

    def _load_image_into_numpy_array(self, image):
        (im_width, im_height) = image.size
        return np.array(image.getdata()).reshape(
            (im_height, im_width, 3)).astype(np.uint8)

    def post_recognized_objects(self, classes, scores):
        objects = []

        for index, value in enumerate(classes[0]):
            if scores[0, index] > self.RECOGNITION_THRESHOLD:
                class_name = self.category_index.get(value).get('name').encode('utf8')

                if self.CLASS_SUBSET != None:
                    with self.lock:
                        if class_name not in self.CLASS_SUBSET:
                            continue
                
                objects.append(class_name)

        if (len(objects) == 0):
            return

        ENDPOINT = "http://127.0.0.1:5000/post-recognized-objects/" + str(self.id)
        payload = {"recognized_objects" : objects}
        r = requests.post(ENDPOINT, params=payload)

    def stop_detecting(self):
        with lock:
            self.STOP = True

    def detect(self):
        with self.detection_graph.as_default():
            with tf.Session(graph=self.detection_graph) as sess:
                while True:
                    with self.lock:
                        if self.STOP:
                            break

                    # Read frame from camera
                    ret, image_np = self.camera.read()

                    if ret is None:
                        break

                    image_np_expanded = np.expand_dims(image_np, axis=0)

                    image_tensor = self.detection_graph.get_tensor_by_name('image_tensor:0')
                    boxes = self.detection_graph.get_tensor_by_name('detection_boxes:0')
                    scores = self.detection_graph.get_tensor_by_name('detection_scores:0')
                    classes = self.detection_graph.get_tensor_by_name('detection_classes:0')
                    num_detections = self.detection_graph.get_tensor_by_name('num_detections:0')

                    # Actual detection.
                    (boxes, scores, classes, num_detections) = sess.run(
                        [boxes, scores, classes, num_detections],
                        feed_dict={image_tensor: image_np_expanded})

                    self.post_recognized_objects(classes, scores)

                    # Visualization of the results of a detection.
                    vis_util.visualize_boxes_and_labels_on_image_array(
                        image_np,
                        np.squeeze(boxes),
                        np.squeeze(classes).astype(np.int32),
                        np.squeeze(scores),
                        self.category_index,
                        use_normalized_coordinates=True,
                        line_thickness=8)

                    # Display output
                    cv2.imshow('object detection', cv2.resize(image_np, (800, 600)))

                    if cv2.waitKey(25) & 0xFF == ord('q'):
                        cv2.destroyAllWindows()
                        break
