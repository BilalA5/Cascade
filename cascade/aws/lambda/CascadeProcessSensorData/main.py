# Important libraries
import boto3, json, os, pandas as pd
from datetime import datetime

# Establish S3 and DB connection
s3 = boto3.client('S3')
dynamodb = boto3.resource('dynamodb')

#dynamo and s3 constants
TABLE = os.environ.get('TABLE_NAME', 'CascadeReadings')
BUCKET = os.environ.get('BUCKET_NAME', 'cascade-reports')

#Create Lambda Handler Function to Ingest and Process Data
def lambda_handler(event,context):
    
    #Get the data and store it into DynamoDB
    try : 
        body = json.loads(event.get("body", "{}"))

        #Validate Required Fields
        required = []
        

        