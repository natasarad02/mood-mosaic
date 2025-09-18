import boto3
import json

client = boto3.client(
    "lambda",
    endpoint_url="http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1"
)


payload = {
    "httpMethod": "POST",
    "body": json.dumps({
        "emoji": ":)",
        "text": "Hello from Python test"
    })
}

response = client.invoke(
    FunctionName="MoodLambda",
    Payload=json.dumps(payload)
)


body = json.loads(response["Payload"].read())
print(json.dumps(body, indent=2))
