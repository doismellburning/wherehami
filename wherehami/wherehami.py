import flask

app = flask.Flask(__name__)

@app.context_processor
def inject_google_analytics_id():
    return {'GOOGLE_ANALYTICS_ID': os.getenv('GOOGLE_ANALYTICS_ID')}

@app.context_processor
def inject_google_maps_api_key():
    return {'GOOGLE_MAPS_API_KEY': os.getenv('GOOGLE_MAPS_API_KEY')}

@app.route('/')
def index():
    return flask.render_template('wherehami.html')

if __name__ == '__main__':
    import os
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = bool(os.getenv('WHEREHAMI_DEBUG', False))

    app.run(port=PORT, debug=DEBUG)
