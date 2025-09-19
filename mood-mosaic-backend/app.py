import boto3
import json
from flask import Flask, jsonify
from flask_cors import CORS
import os 

# API varijable
API_NAME = "MoodAPI"
RESOURCE_PATH = "moods"
LAMBDA_ARN = "arn:aws:lambda:us-east-1:000000000000:function:MoodLambda"
REGION = "us-east-1"

# LocalStack endpoint
ENDPOINT_URL = "http://localhost:4566"

# Klijent
apigw = boto3.client(
    "apigateway",
    endpoint_url=ENDPOINT_URL,
    region_name=REGION,
    aws_access_key_id="test",
    aws_secret_access_key="test"
)

# Kreiranje REST API-ja
apis = apigw.get_rest_apis()["items"]
existing_api = next((a for a in apis if a["name"] == API_NAME), None)
if existing_api:
    api_id = existing_api["id"]
    print(f"API '{API_NAME}' already exists with id {api_id}")
else:
    resp = apigw.create_rest_api(name=API_NAME)
    api_id = resp["id"]
    print(f"Created API '{API_NAME}' with id {api_id}")

# ROOT resurs
resources = apigw.get_resources(restApiId=api_id)["items"]
root_id = next(r["id"] for r in resources if r["path"] == "/")

# Kreiranje /moods resursa
resource = next((r for r in resources if r.get("pathPart") == RESOURCE_PATH), None)
if resource:
    resource_id = resource["id"]
    print(f"Resource '/{RESOURCE_PATH}' already exists")
else:
    resource = apigw.create_resource(
        restApiId=api_id,
        parentId=root_id,
        pathPart=RESOURCE_PATH
    )
    resource_id = resource["id"]
    print(f"Created resource '/{RESOURCE_PATH}'")

# Kreiranje metoda
for method in ["GET", "POST"]:
    try:
        apigw.get_method(restApiId=api_id, resourceId=resource_id, httpMethod=method)
        print(f"Method {method} already exists")
    except apigw.exceptions.NotFoundException:
       
        apigw.put_method(
            restApiId=api_id,
            resourceId=resource_id,
            httpMethod=method,
            authorizationType="NONE"
        )
        print(f"Created method {method}")

        apigw.put_integration(
            restApiId=api_id,
            resourceId=resource_id,
            httpMethod=method,
            type="AWS_PROXY",
            integrationHttpMethod="POST",
            uri=f"arn:aws:apigateway:{REGION}:lambda:path/2015-03-31/functions/{LAMBDA_ARN}/invocations"
        )
        print(f"Integrated {method} with Lambda")

        # Dodavanje CORS headers
        apigw.put_method_response(
            restApiId=api_id,
            resourceId=resource_id,
            httpMethod=method,
            statusCode="200",
            responseParameters={
                "method.response.header.Access-Control-Allow-Origin": True
            }
        )
        apigw.put_integration_response(
            restApiId=api_id,
            resourceId=resource_id,
            httpMethod=method,
            statusCode="200",
            responseParameters={
                "method.response.header.Access-Control-Allow-Origin": "'http://localhost:3000'"
            }
        )


# Kreiranje OPTIONS metoda
try:
    apigw.get_method(restApiId=api_id, resourceId=resource_id, httpMethod="OPTIONS")
    print("OPTIONS method already exists")
except apigw.exceptions.NotFoundException:
    apigw.put_method(
        restApiId=api_id,
        resourceId=resource_id,
        httpMethod="OPTIONS",
        authorizationType="NONE"
    )
    apigw.put_integration(
        restApiId=api_id,
        resourceId=resource_id,
        httpMethod="OPTIONS",
        type="MOCK",
        requestTemplates={"application/json": '{"statusCode":200}'}
    )
    apigw.put_method_response(
        restApiId=api_id,
        resourceId=resource_id,
        httpMethod="OPTIONS",
        statusCode="200",
        responseParameters={
            "method.response.header.Access-Control-Allow-Headers": True,
            "method.response.header.Access-Control-Allow-Methods": True,
            "method.response.header.Access-Control-Allow-Origin": True
        }
    )
    apigw.put_integration_response(
        restApiId=api_id,
        resourceId=resource_id,
        httpMethod="OPTIONS",
        statusCode="200",
        responseParameters={
            "method.response.header.Access-Control-Allow-Origin": "'http://localhost:3000'",
            "method.response.header.Access-Control-Allow-Methods": "'GET,POST,OPTIONS'",
            "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
        }
    )
    print("Created OPTIONS method for CORS")

# API deployment

apigw.create_deployment(
    restApiId=api_id,
    stageName="stage"
)
print("API deployed to stage 'stage'")

# Kreiranje S3 bucket-a

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1"
)

bucket_name = "mood-images"
folder_path = "images"


try:
    s3.create_bucket(Bucket=bucket_name)
    print(f"Bucket '{bucket_name}' created.")
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f"Bucket '{bucket_name}' already exists.")


public_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject"],
            "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
        }
    ]
}
s3.put_bucket_policy(Bucket=bucket_name, Policy=json.dumps(public_policy))
print(f"Bucket '{bucket_name}' is now public for GET requests.")


for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)
    if os.path.isfile(file_path):
        s3.upload_file(file_path, bucket_name, filename)
        print(f"Uploaded file: {filename}")

print("Bucket setup complete")


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route("/api/s3-images")
def get_s3_images():
    objects = s3.list_objects_v2(Bucket=bucket_name).get("Contents", [])
    urls = [
        s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": obj["Key"]},
            ExpiresIn=3600  # 1 hour valid
        )
        for obj in objects
    ]
    return jsonify(urls)

@app.route("/api/api-id")  # Pomocna metoda za dobavljanje API_ID
def get_api_id():
    apis = apigw.get_rest_apis()["items"]
    existing_api = next((a for a in apis if a["name"] == API_NAME), None)
    if existing_api:
        return jsonify({"apiId": existing_api["id"]})
    return jsonify({"error": "API not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)