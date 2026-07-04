import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load variables from .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

MONGO_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DATABASE_NAME")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    """Connect to MongoDB on application startup."""
    print("Connecting to MongoDB Cluster...")
    # Added tlsCAFile to handle the ssl=true requirement securely
    db.client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db.db = db.client[DB_NAME]
    print("Successfully connected to MongoDB!")

async def close_mongo_connection():
    """Close the MongoDB connection on application shutdown."""
    if db.client:
        db.client.close()
        print("MongoDB connection closed.")