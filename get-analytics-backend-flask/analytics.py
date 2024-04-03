# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 15:09:05 2024

@author: alakh
"""

from flask import Flask, jsonify
from flask_cors import CORS
from utils import connect_to_mongodb
from utils import fetch_analytics
from utils import plot_graph
from bson import json_util
import os
app = Flask(__name__)
CORS(app)
mongodb_url = os.environ.get('MONGODB_URL')
if mongodb_url is None:
    raise ValueError("MongoDB URL not found in environment variables.")

client = connect_to_mongodb(mongodb_url)

# Route to test CORS
@app.route('/')
def get_data():
    data = {'message': 'Hello, from Analytics Backend - Flask!'}
    return jsonify(data)


@app.route('/analytic/<string:project_url>', methods=['GET'])
def get_analytics(project_url):
    print(project_url)
    project_url = "http://" + project_url[5:len(project_url)]
    print(project_url)

    data = fetch_analytics(client, project_url)
    
    serialized_data = json_util.dumps(data)
    
    image_data = plot_graph(serialized_data)
    
    return jsonify({'image': image_data}), 200



if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
