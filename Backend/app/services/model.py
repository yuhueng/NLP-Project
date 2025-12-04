from app.models.schemas import ChatMessage, MessageRole
from app.config import settings
from typing import List, Dict, Any, Optional
import time
import logging
from gradio_client import Client

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SinglishModelService:
    """
    Production-ready model service for Singlish chatbot.
    Uses Hugging Face inference API via gradio_client.
    """

    def __init__(self):
        self.client = None
        self.model_loaded = False

        # Initialize the HuggingFace client
        self._load_model()

    def _load_model(self):
        """Initialize the HuggingFace inference client."""
        try:
            logger.info("Initializing HuggingFace inference client...")

            # Initialize gradio client with the same space used in test_model.py
            self.client = Client(
                "yuhueng/SinglishTest",
                token=settings.hf_token
            )

            self.model_loaded = True
            logger.info("HuggingFace inference client initialized successfully!")

        except Exception as e:
            logger.error(f"Failed to initialize HF client: {str(e)}")
            self.client = None
            self.model_loaded = False

    def _format_conversation(self, message: str, conversation_history: List[ChatMessage] = None) -> str:
        """Format conversation history and current message for the model."""
        if conversation_history is None:
            conversation_history = []

        # Simple conversation format (compatible with most models)
        conversation = f"System: {settings.system_prompt}\n\n"

        # Add conversation history (last 3 messages to avoid context overflow)
        for msg in conversation_history[-3:]:
            if msg.role == MessageRole.USER:
                conversation += f"User: {msg.content}\nAssistant: "
            elif msg.role == MessageRole.ASSISTANT:
                conversation += f"{msg.content}\n"

        # Add current message
        conversation += f"User: {message}\nAssistant: "

        return conversation

    def _generate_with_model(self, message: str, conversation_history: List[ChatMessage] = None) -> str:
        """Generate response using the HuggingFace inference client."""
        if not self.model_loaded or self.client is None:
            raise ValueError("Model client not loaded")

        try:
            # Start timing for performance tracking
            start_time = time.perf_counter()

            # Use the gradio client to generate response (same as test_model.py)
            result = self.client.predict(
                prompt=message,
                api_name="/inference"
            )

            end_time = time.perf_counter()
            elapsed = end_time - start_time
            logger.info(f"Inference time: {elapsed:.3f} seconds")

            return str(result).strip()

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise ValueError(f"Generation failed: {str(e)}")

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> str:
        """
        Generate a Singlish response based on the input message and conversation history.
        Uses the HuggingFace inference client.
        """
        if conversation_history is None:
            conversation_history = []

        # Try to use the model client if loaded
        if self.model_loaded:
            try:
                return self._generate_with_model(message, conversation_history)
            except Exception as e:
                logger.error(f"Model generation failed: {str(e)}")
                raise ValueError(f"Failed to generate response: {str(e)}")
        else:
            raise ValueError("Model client not loaded - cannot generate response")

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the model service."""
        return {
            "model_loaded": self.model_loaded,
            "inference_type": "HuggingFace API",
            "hf_space": "yuhueng/SinglishTest",
            "local_model": "No (remote inference)",
            "adapters_loaded": bool(settings.adapter_repo_name),
            "adapter_repo": settings.adapter_repo_name or "Not applicable for API inference"
        }

# Singleton instance
model_service = SinglishModelService()