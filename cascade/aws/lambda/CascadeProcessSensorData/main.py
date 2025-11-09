# Important libraries
import base64
import json
import logging
import os
from datetime import datetime
from decimal import Decimal

import boto3

# Establish S3 and DB connection
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

#dynamo and s3 constants
TABLE = os.environ.get('TABLE_NAME', 'CascadeReadings')
BUCKET = os.environ.get('BUCKET_NAME', 'cascade-reports')

# Helper utilities
def _load_event_body(event: dict) -> dict:
    """
    Safely extract and normalise the payload sent from API Gateway / AWS IoT.
    Ensures any numeric values are converted to Decimal so that DynamoDB accepts them.
    """
    body = event.get("body")

    # Some triggers (e.g. direct invocation) may already send a dict payload.
    if isinstance(body, dict):
        raw_payload = body
    else:
        # API Gateway can base64 encode the body when binary support is enabled.
        if isinstance(body, (bytes, bytearray)):
            body = body.decode("utf-8")
        if body and event.get("isBase64Encoded"):
            body = base64.b64decode(body).decode("utf-8")
        if isinstance(body, str):
            try:
                raw_payload = json.loads(body, parse_float=Decimal)
            except json.JSONDecodeError as exc:
                logger.warning("Unable to decode request body as JSON: %s", exc)
                raise ValueError("Request body must be valid JSON.")
        else:
            raw_payload = {}

    if not isinstance(raw_payload, dict):
        raise ValueError("Payload must be a JSON object.")

    return raw_payload


def _ensure_decimal(value):
    if value is None:
        return None
    if isinstance(value, Decimal):
        return value
    if isinstance(value, bool):
        # DynamoDB does not accept bool subclasses of Decimal.
        return value
    if isinstance(value, (int, float, str)):
        try:
            return Decimal(str(value))
        except Exception:
            return value
    return value


class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that converts Decimal instances into float for the HTTP response."""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


#Create Lambda Handler Function to Ingest and Process Data
def lambda_handler(event,context):
    
    #Get the data and store it into DynamoDB
    try : 
        logger.info("Received event: %s", json.dumps({k: v for k, v in event.items() if k != "body"}))

        body = _load_event_body(event)

        # Normalise timestamps and field names
        timestamp = body.get("timestamp")
        if not timestamp:
            timestamp = datetime.utcnow().isoformat(timespec="seconds") + "Z"
            body["timestamp"] = timestamp

        #Validate Required Fields
        required = ["device_id", "moisture"]
        missing = [f for f in required if f not in body]
        if missing:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"Missing fields: {', '.join(missing)}"})
            }
        
        # Validate timestamp format
        try:
            datetime.fromisoformat(body["timestamp"].replace("Z", ""))
        except ValueError:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Invalid timestamp format. Must be ISO8601 (e.g., 2025-11-09T01:35:24Z)."})
            }

        # Align field names with downstream expectations
        if "moisture_pct" not in body and "moisture" in body:
            body["moisture_pct"] = body["moisture"]
        if "humidity_pct" in body and "humidity" not in body:
            body["humidity"] = body["humidity_pct"]
        if "health_score" not in body:
            body["health_score"] = _ensure_decimal(body.get("plant_health") or body.get("health") or Decimal("0"))
        else:
            body["health_score"] = _ensure_decimal(body["health_score"])
        if "pest_score" not in body:
            body["pest_score"] = _ensure_decimal(body.get("pestRisk") or body.get("pest_score") or Decimal("0"))
        else:
            body["pest_score"] = _ensure_decimal(body["pest_score"])

        for field in ["moisture", "moisture_pct", "humidity", "humidity_pct", "temperature", "ph"]:
            if field in body:
                body[field] = _ensure_decimal(body[field])
        
        # Write to DynamoDB
        table = dynamodb.Table(TABLE)
        table.put_item(Item=body)
        logger.info("Stored reading for device %s at %s", body.get("device_id"), body.get("timestamp"))

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Data stored successfully.", "item": body}, cls=DecimalEncoder)
        }

    except Exception as e:
        print("Error:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
