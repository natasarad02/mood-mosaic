import boto3
import zipfile
import io
import os

lambda_client = boto3.client(
    "lambda",
    endpoint_url="http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1"
)

lambda_name = "MoodLambda"

zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write("lambda_function.py") 
  

zip_buffer.seek(0)


try:
    lambda_client.get_function(FunctionName=lambda_name)
    print(f"Lambda {lambda_name} already exists, updating code...")
    lambda_client.update_function_code(
        FunctionName=lambda_name,
        ZipFile=zip_buffer.read()
    )
except lambda_client.exceptions.ResourceNotFoundException:
    print(f"Creating Lambda {lambda_name}...")
    lambda_client.create_function(
        FunctionName=lambda_name,
        Runtime="python3.11",
        Role="arn:aws:iam::000000000000:role/lambda-role",
        Handler="lambda_function.lambda_handler",
        Code={"ZipFile": zip_buffer.read()},
        Timeout=10,
        MemorySize=128
    )

print("Done!")