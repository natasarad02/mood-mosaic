import json
import uuid
from datetime import datetime
import boto3

# DynamoDB setup
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url='http://host.docker.internal:4566',
    aws_access_key_id='test',
    aws_secret_access_key='test',
    region_name='us-east-1'
)

def get_or_create_table(table_name='Moods'):
    existing_tables = dynamodb.meta.client.list_tables()['TableNames']
    if table_name not in existing_tables:
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST'
        )
        table.wait_until_exists()
    else:
        table = dynamodb.Table(table_name)
    return table

table = get_or_create_table()

def lambda_handler(event, context):
    method = event.get('httpMethod')
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    }

    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        emoji = body.get('emoji', ':)')
        text = body.get('text', '')

        moodItem = {
            'id': str(uuid.uuid4()),
            'emoji': emoji,
            'text': text,
            'timestamp': datetime.utcnow().isoformat()
        }

        table.put_item(Item=moodItem)
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'message':'ok', 'item':moodItem})}

    elif method == 'GET':
        resp = table.scan()
        items = sorted(resp.get('Items', []), key=lambda x: x.get('timestamp', ''))
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(items)}

    elif method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'message': 'CORS preflight'})}

    else:
        return {'statusCode': 400, 'headers': headers, 'body': 'Unsupported method'}
