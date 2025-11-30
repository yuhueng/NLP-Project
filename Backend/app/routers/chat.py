from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, HealthCheck, ErrorResponse
from app.services.model import model_service
from datetime import datetime

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that processes user messages and returns Singlish responses.
    """
    try:
        # Generate response using the model service
        response_text = model_service.generate_response(
            message=request.message,
            conversation_history=request.conversation_history
        )

        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """
    Health check endpoint to verify API is working.
    """
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now()
    )

@router.get("/model-status")
async def model_status():
    """
    Get the current status of the loaded model.
    """
    return {
        "status": "ok",
        "model": model_service.get_model_status()
    }

@router.get("/")
async def chat_info():
    """
    Information about the chat API.
    """
    model_status_info = model_service.get_model_status()

    return {
        "message": "Singlish Chatbot API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "health": "/api/health",
            "model_status": "/api/model-status"
        },
        "status": "operational",
        "model": model_status_info
    }