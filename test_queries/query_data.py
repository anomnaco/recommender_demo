import requests
import json
from sentence_transformers import SentenceTransformer
import csv
import pprint 

pp = pprint.PrettyPrinter(indent=4)

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
import random
def main(filepath):
    data_file = load_csv_file(filepath)
    for k in range(0,1):
        print("----------------------------------------------")
        print(k)
        row = data_file[random.randint(1,10000)]
        product_dict = {key.lower().replace(" ","_"): row[key] for key in ("Product Name", "Brand Name", "Category", "Selling Price", "About Product", "Product Url")}
        pprint.pprint(product_dict)
        print("----------------------------------------------")


        # Can we search by non-vector field value?
        payload = json.dumps({
        "findOne": {
            "filter": {
                "product_name": product_dict["product_name"]
        }}})

        print("Result when searching by product_name non-vector field:")
        print("===================")
        response = requests.request("POST", request_url, headers=request_headers, data=payload)
        response_dict = json.loads(response.text)
        d = response_dict['data']['document']
        del d['$vector']
        pprint.pprint(d)
        print(" ")
        print("----------------------------------------------")


        # search for product data vector
        to_embed_product_string = json.dumps(product_dict)
        embedded_product = embed(to_embed_product_string)

        payload = json.dumps({
        "find": {
            "sort": {
              "$vector": embedded_product
            },
            "options": {
              "limit": 10
            }
        }})

        print("top 10 when searching for product details vector:")
        print("===================")
        response = requests.request("POST", request_url, headers=request_headers, data=payload)
        response_dict = json.loads(response.text)
        for d in response_dict['data']['documents']:
            del d['$vector']
            pprint.pprint(d)
            print(" ")
        print("nextPageState", response_dict['data']['nextPageState'])
        print("----------------------------------------------")


        # search for product name vector
        to_embed_product_name = product_dict["product_name"]
        embedded_product_name = embed(to_embed_product_string)

        payload = json.dumps({
        "find": {
            "sort": {
              "$vector": embedded_product_name
            },
            "options": {
              "limit": 10
            }
        }})

        print("top 10 when searching for product name vector:")
        print("===================")
        response = requests.request("POST", request_url, headers=request_headers, data=payload)
        response_dict = json.loads(response.text)
        for d in response_dict['data']['documents']:
            del d['$vector']
            pprint.pprint(d)
            print(" ")
        print("nextPageState", response_dict['data']['nextPageState'])
        print("----------------------------------------------")

if __name__ == "__main__":
    filepath = sys.argv[1]
    main(filepath)
