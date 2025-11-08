import boto3, json, os, pandas as pd
from datetime import datetime

#Initalize S3 & DynamoDB
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

#DB and S3 Bucket constants
TABLE = os.environ.get('TABLE_NAME', 'CascadeReadings')
BUCKET = os.environ.get('BUCKET_NAME', 'cascade-reports')

#Lambda Helper function
def lambda_handler(event,context):
    table = dynamodb.Table(TABLE)
    device_id = event.get("device_id", "ESP32_01")
