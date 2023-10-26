import requests
import json
from sentence_transformers import SentenceTransformer
import csv

import sys
sys.path.append('../utils')
from local_creds import *

request_url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{KEYSPACE_NAME}/{COLLECTION_NAME}"
request_headers = { 'x-cassandra-token': app_token,  'Content-Type': 'application/json'}

def load_csv_file(filename):
    result = []
    with open(filename, newline='\n') as temp_csvfile:
        temp_reader = csv.DictReader(temp_csvfile)
        for row in temp_reader:
                result.append(row)

    return result

def embed(text_to_embed):
    model_name = "intfloat/multilingual-e5-small"
    model = SentenceTransformer(model_name)
    embedding = list(model.encode(text_to_embed))
    return [float(component) for component in embedding]

def main(filepath):
    count = 0
    data_file = load_csv_file(filepath)
    for row in data_file:
        to_embed = {key.lower().replace(" ","_"): row[key] for key in ("Product Name", "Brand Name", "Category", "Selling Price", "About Product", "Product Url")}
        #print(to_embed.keys())
        to_embed_string = json.dumps(to_embed)
        embedded_product = embed(to_embed_string)
        #print(type(embedded_product[0]))
        to_insert = {key.lower().replace(" ","_"): row[key] for key in row.keys()}
        to_insert["$vector"] = embedded_product
        request_data = {}
        request_data["insertOne"] = {"document": to_insert}
        #print(request_data)
        response = requests.request("POST", request_url, headers=request_headers, data=json.dumps(request_data))
        print(response.text + "\t Count: "+str(count))
        count+=1

if __name__ == "__main__":
    filepath = sys.argv[1]
    main(filepath)
