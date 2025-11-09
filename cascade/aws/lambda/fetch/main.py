# Important libraries
import boto3, json, os, pandas as pd
from datetime import datetime

# Establish S3 and DB connection
s3 = boto3.client('S3')
dynamodb = boto3.resource('dynamodb')

#dynamo and s3 constants
TABLE = os.environ.get('TABLE_NAME', 'CascadeReadings')
BUCKET = os.environ.get('BUCKET_NAME', 'cascade-reports')

#Create Lambda Handler Function
def lambda_handler(event,context):
    table = dynamodb.table(TABLE)
    bucket = event.get("device_id", "ESP32_01")

    #Latest Readings
    response = table.scan(Limit = 10)
    items = response["Items"]

    if not items:
        

        