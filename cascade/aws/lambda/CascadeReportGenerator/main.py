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

    #Get Current Response Readings
    response = table.scan(Limit = 10)
    items = response["Items"]

    #Process Data as a dataframe
    df = pd.DataFrame(items)

    report_summary  = {
        "time_stamp" : datetime.utcnow().isoformat() + "Z",
        "moisture_percent" : df["moisture_pct"].astype(float).mean(),
        "pest_score" : df["pest_score"].astype(int).mean(),
        "plant_health" : df["health_score"].astype(float).mean(),
    }

    #If possible get the old report from S3 Bucket

    prev_report = {}

    try:
        last_report = s3.list_objects_v2(Bucket=BUCKET, Prefix=f"{device_id}/reports/")
        if "Contents" in last_report:
            last_key = sorted(last_report["Contents"], key = lambda x : x["LastModified"])[-1]["Key"]
            object = s3.get_object(Bucket=BUCKET, Key=last_key)
            prev_report = json.loads(object["Body"].read().decode("utf-8"))
    except Exception:
        pass

    #Create a comparision report between the conntents of the previous and current report
    compare_reports = {
        "moisture_change" : report_summary["moisture_pct"] - prev_report.get("moisture_pct", 0),
        "pest_change" : report_summary["pest_score"] - prev_report.get("pest_score", 0),
        "health_change" : report_summary["health_score"] - prev_report.get("health_score", 0)
    }

    #Create the finalized report that takes data from current and prev_reports to make a comparision 
    report = {"summary": report_summary, "comparison": compare_reports}
    key = f"{device_id}/reports/report_{report_summary['time_stamp']}.json"
    s3.put_object(Bucket=BUCKET, Key=key, Body=json.dumps(report))

    return {"statusCode": 200, "body": json.dumps(report)}