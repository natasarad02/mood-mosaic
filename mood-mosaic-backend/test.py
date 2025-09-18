import json
from lambda_function import lambda_handler


event_post = {
    "httpMethod": "POST",
    "body": json.dumps({
        "emoji": ":D",
        "text": "Feeling happy!"
    })
}

response = lambda_handler(event_post, None)
print("POST response:", response)

event_get = {"httpMethod": "GET"}
response = lambda_handler(event_get, None)
print("GET response:", response)
