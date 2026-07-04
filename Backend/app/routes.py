# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db

# Create a router to group our endpoints together
router = APIRouter()

@router.get("/api/books")
async def get_all_books():
    """
    Fetches only the necessary book details for the frontend dropdown.
    """
    projection = {
        "_id": 1, 
        "title": 1, 
        "class_no": 1, 
        "subject": 1
    }
    
    try:
        cursor = db.db["BOOKS"].find({}, projection)
        books_list = await cursor.to_list(length=100)
        
        # 3. Format the data exactly how your React <Dropdown /> expects it
        formatted_books = []
        for book in books_list:
            formatted_books.append({
                "id": str(book["_id"]),
                "label": f"{book.get('title', 'Unknown Title')} (Class {book.get('class_no', '?')})"
            })
            
        return formatted_books

    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch books")



@router.get("/api/books/{book_id}/chapters")
async def get_book_chapters(book_id: str):
    """
    Fetches the list of chapters for a specific book using its ID.
    """
    # 1. Validate that the ID the frontend sent is a real MongoDB ID format
    if not ObjectId.is_valid(book_id):
        raise HTTPException(status_code=400, detail="Invalid Book ID format")

    # 2. PROJECTION: We only want the chapter metadata, NOT the heavy PDF text!
    projection = {
        "chapters.id": 1,
        "chapters.chapter_no": 1,
        "chapters.title": 1
    }
    
    try:
        # Note: Make sure "BOOKS" matches your exact collection name from the first API
        book = await db.db["BOOKS"].find_one({"_id": ObjectId(book_id)}, projection)
        
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
            
        formatted_chapters = []
        
        # 3. Extract and format the chapters for the React Dropdown
        for chapter in book.get("chapters", []):
            
            # Safety check: Handle standard ObjectIds AND raw JSON "$oid" dictionaries
            chap_id = chapter.get("id")
            if isinstance(chap_id, dict) and "$oid" in chap_id:
                clean_id = chap_id["$oid"]
            else:
                clean_id = str(chap_id)
                
            formatted_chapters.append({
                "id": clean_id,
                "chapter_no": chapter.get("chapter_no"),
                "label": f"Ch {chapter.get('chapter_no')}: {chapter.get('title')}"
            })
            
        # 4. Sort chapters by their chapter number so they appear in order
        formatted_chapters.sort(key=lambda x: x["chapter_no"] if x["chapter_no"] else 0)
        
        return formatted_chapters

    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch chapters")