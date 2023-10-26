import json
import requests

from api.local_creds import KEYSPACE_NAME, COLLECTION_NAME, ASTRA_DB_ID, ASTRA_DB_REGION, ASTRA_DB_APPLICATION_TOKEN 


url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{KEYSPACE_NAME}"
print(url)

payload = json.dumps({"createCollection": {
    "name": COLLECTION_NAME,
    "options" : {
        "vector" : {
            "size" : 384,
            "function" : "cosine"}}}})

headers = {
    'x-cassandra-token': ASTRA_DB_APPLICATION_TOKEN,
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)