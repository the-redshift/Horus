from flask import Flask, request

app = Flask(__name__,
            static_folder='C:/Users/jwarumze/Desktop/Horus/web/static')
            # static_url_path='/web/static')

@app.route('/')
def root():
    # return app.static_folder
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run()
