import json
import uuid
from datetime import datetime
from db import table 

def lambda_handler(event, context):
    method = event.get('httpMethod')

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
        return {'statusCode': 200, 'body': json.dumps({'message':'ok', 'item':moodItem})}

    elif method == 'GET':
        resp = table.scan()
        items = sorted(resp.get('Items', []), key=lambda x: x.get('timestamp', ''))
        return {'statusCode': 200, 'body': json.dumps(items)}

    else:
        return {'statusCode': 400, 'body': 'Unsupported method'}
