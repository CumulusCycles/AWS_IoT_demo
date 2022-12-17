import boto3

def lambda_handler(event, context):
    client = boto3.client('dynamodb')

    response = client.put_item(
        TableName = 'raspiData_v3',
        Item = {
            'timestamp': {'S': event['timestamp']},
            'distance': {'N': str(event['distance'])},
            'status': {'S': event['status']}
        }
    )

    return 0
