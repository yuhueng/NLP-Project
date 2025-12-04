from app.models.schemas import ChatMessage, MessageRole
from app.config import settings
from typing import List, Dict, Any, Optional
import time
import json
import ast
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

  
    def _generate_with_model(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """Generate response using the HuggingFace inference client."""
        if not self.model_loaded or self.client is None:
            raise ValueError("Model client not loaded")

        try:
            # Start timing for performance tracking
            start_time = time.perf_counter()

            # Use the gradio client to generate response
            # Note: Using positional argument for prompt is often safer if param names change
            result = self.client.predict(
                message, 
                api_name="/inference"
            )

            end_time = time.perf_counter()
            elapsed = end_time - start_time
            logger.info(f"Inference time: {elapsed:.3f} seconds")
            
            # 2. Parse the String -> Dictionary
            parsed_data = {}

            try:
                # Attempt 1: Try standard JSON (Expects double quotes: {"key": "val"})
                parsed_data = json.loads(result)

            except json.JSONDecodeError:
                try:
                    # Attempt 2: Try Python Literal (Handles single quotes: {'key': 'val'})
                    # This is safer than eval() and fixes the specific error you saw earlier
                    parsed_data = ast.literal_eval(result)
                except (ValueError, SyntaxError):
                    # Fallback: If parsing fails entirely, treat the whole string as the response
                    logger.warning("Could not parse model output as JSON/Dict. Using raw string.")
                    parsed_data = {"response": result, "safety": "Unknown"}

            # 3. Now you can safely use it as a dictionary
            final_response = {
                'response': str(parsed_data.get('response', '')).strip(),
                'safety': str(parsed_data.get('safety', 'Unknown')).strip()
            }

            return final_response
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")


    
    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> Dict[str, str]:
        """
        Generate a Singlish response with safety information.
        Returns both the response and safety information.
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