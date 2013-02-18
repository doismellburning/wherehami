import flask

app = flask.Flask(__name__)

@app.route('/')
def index():
    return flask.render_template('wherehami.html')

if __name__ == '__main__':
    import os
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = bool(os.getenv('WHEREHAMI_DEBUG', False))

    app.run(port=PORT, debug=DEBUG)
