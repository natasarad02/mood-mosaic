import boto3

# Create the DynamoDB resource
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url='http://localhost:4566',
    aws_access_key_id='test',
    aws_secret_access_key='test',
    region_name='us-east-1'
)

def get_table(table_name='Moods'):
    """
    Get existing table or create it if it doesn't exist.
    Called lazily inside Lambda handler to avoid blocking at import.
    """
    existing_tables = dynamodb.meta.client.list_tables()['TableNames']
    
    if table_name not in existing_tables:
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST'
        )
        # Wait until table exists before returning
        table.wait_until_exists()
    else:
        table = dynamodb.Table(table_name)
    
    return table
