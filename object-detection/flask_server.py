from threading import Lock
import os
from flask import Flask, abort, jsonify, request
from object_recognition import ObjectRecognition

lock = Lock()
recognized_objects = []
app = Flask(__name__)

@app.route('/')
def root():
    return "Horus"

# Endpoint to start recognition on a given camera
@app.route("/start/<camera_id>", methods=['POST'])
def start_camera(camera_id):
    if camera_id in cameras:
        return "Camera already exists."

    path_to_labels = os.path.join('C:\\Users\\jwarumze\\TensorFlow\\models\\research\\object_detection\\data', \
             'mscoco_label_map.pbtxt')
    path_to_vid = os.path.join('C:\\Users\\jwarumze\\Desktop\\', "car.avi")

    cameras[camera_id] = ObjectRecognition(50, path_to_vid, path_to_labels)
    cameras[camera_id].detect()

    resp = jsonify(success=True)
    return resp

# Endpoint to stop recognition on a given camera
@app.route("/stop/<camera_id>", methods=['POST'])
def stop_camera(camera_id):
    try:
        cameras[camera_id].stop_detecting()
        del cameras[camera_id]

    except KeyError:
        abort(404)

# Endpoint to change subset of recognized classes
@app.route("/specify-class-subset/<camera_id>", methods=['POST'])
def specify_class_subset(camera_id):
    try:
        new_class_subset = request.get_json(force=True)
        new_class_subset = new_class_subset['class_subset']

        # TODO: add in class

    except KeyError:
        abort(404)

# Endpoint to dump recognized classes
@app.route("/post-recognized-objects/<camera_id>", methods=['POST'])
def post_objects(camera_id):
    try:
        recognized = request.get_json(force=True)
        recognized = recognized['recognized_objects']

        with lock:
            recognized_objects[camera_id] = recognized

    except KeyError:
        abort(404)

# Endpoint to fetch recognized classes
@app.route("/fetch-recognized-objects/<camera_id>", methods=['GET'])
def fetch_objects(camera_id):
    with lock:
        try:
            object_list = recognized_objects[camera_id]
            return jsonify({"recognized_objects" : object_list})

        except KeyError:
            abort(404)

if __name__ == "__main__":
    app.run()
