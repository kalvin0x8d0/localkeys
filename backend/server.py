from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, ValidationError
from typing import List
import uuid
from datetime import datetime, timezone
import sys


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get environment variables with defaults where appropriate
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'localkeys')

if not mongo_url or not db_name:
    raise ValueError("Required environment variables MONGO_URL and DB_NAME must be set")

# MongoDB connection
try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")
    sys.exit(1)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    try:
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)

        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()

        result = await db.status_checks.insert_one(doc)
        logger.info(f"Status check created with ID: {result.inserted_id}")
        return status_obj
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=422, detail="Invalid input data")
    except PyMongoError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database operation failed")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    try:
        # Exclude MongoDB's _id field from the query results
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        logger.info(f"Retrieved {len(status_checks)} status checks")

        # Convert ISO string timestamps back to datetime objects
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])

        return status_checks
    except PyMongoError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve status checks")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Include the router in the main app
app.include_router(api_router)

# Configure CORS with explicit allowed origins
cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000')
allow_origins = [origin.strip() for origin in cors_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Configure logging
log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)
logger.info(f"Logging configured at {log_level} level")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()