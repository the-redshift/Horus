from threading import Lock
import os
from flask import Flask, abort, jsonify, request, Response
from object_recognition import ObjectRecognition
from flask_cors import CORS
from tinydb import TinyDB, Query
import time

db = TinyDB("db.json")
lock = Lock()
recognized_objects = {}
cameras = {}
app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return "Horus"

# Endpoint to start recognition on a given camera
@app.route("/start/<camera_id>", methods=['POST'])
def start_camera(camera_id):
    filename = request.args.get('filename')
    if filename == None:
        abort(400)

    if camera_id in cameras:
        return "Camera already exists."

    path_to_labels = os.path.join('C:\\Users\\jwarumze\\TensorFlow\\models\\research\\object_detection\\data', \
             'mscoco_label_map.pbtxt')
    path_to_vid = os.path.join('C:\\Users\\jwarumze\\Desktop\\', str(filename))

    cameras[camera_id] = ObjectRecognition(camera_id, 0.50, path_to_vid, path_to_labels)
    cameras[camera_id].detect()

    resp = jsonify(success=True)
    return resp

# Endpoint to stop recognition on a given camera
@app.route("/stop/<camera_id>", methods=['POST'])
def stop_camera(camera_id):
    try:
        cameras[camera_id].stop_detecting()
        del cameras[camera_id]

        return Response(status=200)

    except KeyError:
        abort(404)

# Endpoint to set alerting for a given camera
@app.route("/configure-alerting/<camera_id>", methods=['POST'])
def configure_alerting(camera_id):
    try:
        mail = request.args.get('mail')
        objects = request.args.get('objects')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        cameras[camera_id].set_alerts(mail, objects, start_date, end_date)

        return Response(status=200)

    except KeyError:
        abort(404)

# Endpoint to change subset of recognized classes
@app.route("/specify-class-subset/<camera_id>", methods=['POST'])
def specify_class_subset(camera_id):
    try:
        new_class_subset = request.args.get('class_subset')
        print(new_class_subset)
        cameras[camera_id].specify_class_subset(new_class_subset)

        return Response(status=200)

    except KeyError:
        abort(404)

# Endpoint to dump recognized classes
@app.route("/post-recognized-objects/<camera_id>", methods=['POST'])
def post_objects(camera_id):
    try:
        recognized = request.args.get('recognized_objects')
        timestamp = int(time.time())

        if recognized == None:
            abort(400)

        with lock:
            recognized_objects[camera_id] = recognized

        db.insert({'timestamp': timestamp, 'recgonized_objects': str(recognized_objects)})
        return Response(status=200)

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
