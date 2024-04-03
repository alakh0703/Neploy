# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 15:12:43 2024

@author: alakh
"""

from pymongo import MongoClient
import matplotlib.pyplot as plt
from datetime import datetime
import matplotlib.pyplot as plt
from collections import defaultdict
from bson import json_util
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from collections import defaultdict
import io
import base64
import os
IMAGE_DIR = 'images'
os.makedirs(IMAGE_DIR, exist_ok=True)

def connect_to_mongodb(url):
    try:
        client = MongoClient(url)
        
        client.server_info()
        
        print("Connected to MongoDB successfully!")
        
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None
    

def fetch_analytics(client, project_url):
    try:
        db = client['Neploy']  
        analytics_collection = db['analytics']

        analytics_data = analytics_collection.find({'projectUrl': project_url})

        analytics_list = list(analytics_data)

        return analytics_list
    except Exception as e:
        print(f"Error fetching analytics data: {e}")
        return None
    
def plot_graph(data):
    data = deserialize_data(data)

    days = [date.date() for date in data]

    day_counts = defaultdict(int)
    for day in days:
        day_counts[day] += 1

    sorted_counts = sorted(day_counts.items())

    x_values = [day for day, _ in sorted_counts]
    y_values = [count for _, count in sorted_counts]

    sns.set_style("darkgrid")

    plt.figure(figsize=(10, 6))
    sns.lineplot(x=x_values, y=y_values, marker='o', color='cyan')
    
    plt.xlabel('Day', fontsize=12, color='lightgray')
    plt.ylabel('Number of Visits', fontsize=12, color='lightgray')
    plt.title('Website Visits Over Time', fontsize=14, color='lightgray')
    
    plt.xticks(rotation=45, color='lightgray')
    
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)

    encoded_img = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close()  # Close the plot to release resources
    return encoded_img




    
def deserialize_data(serialized_data):
    try:
        # Deserialize the JSON string back into Python objects
        deserialized_data = json_util.loads(serialized_data)
        deserialized_data = deserialized_data[0]["analytic"]
        
        print(deserialized_data)
        data2 = []
        
        for i in deserialized_data:
            data2.append(i['date'])
        print("DATA",data2)
        return data2
    except Exception as e:
        print(f"Error deserializing data: {e}")
        return None
    
