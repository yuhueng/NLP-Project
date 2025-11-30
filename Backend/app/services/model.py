from app.models.schemas import ChatMessage, MessageRole
from app.config import settings
from typing import List, Dict, Any, Optional
import torch
import random
from datetime import datetime
import logging
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    pipeline
)
import gc

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SinglishModelService:
    """
    Production-ready model service for Singlish chatbot.
    Integrates with Hugging Face models.
    Falls back to mock responses when model is not available.
    """

    def __init__(self):
        self.pipeline = None
        self.device = None
        self.model_loaded = False

        # Mock Singlish responses for fallback
        self.mock_responses = [
            "Wah lah eh, that one quite interesting leh!",
            "Can can, no problem bro!",
            "Aiyoh, why you ask like that?",
            "Confirm plus chop, I agree with you.",
            "Don't play play ah, this one serious.",
            "Eh, you got WhatsApp or not?",
            "Limpeh tell you, this one damn good.",
            "Siao eh, you crazy or what?",
            "Bojio! Never call me along!",
            "Kiasu a bit, must be number one!",
            "Alamak, why you so slow?",
            "Shiok! This one really power.",
            "Chiong ah! We can do this!",
            "Got budget anot? Need to check first.",
            "Auntie/Uncle style: Cheap cheap good good!",
            "Why you so kpo? Mind your own business.",
            "Wait long long, still not ready yet.",
            "Sure or not? Don't bluff me ah.",
            "No choice lah, have to do it.",
            "Next time better, can or not?"
        ]

        self.contextual_responses = {
            "greeting": [
                "Eh hello! How can I help you today?",
                "Yo! What's up bro?",
                "Hi hi! Long time no see!"
            ],
            "goodbye": [
                "Okok, see you next time!",
                "Bye bye! Take care ah!",
                "Alright then, ciao!"
            ],
            "thanks": [
                "You're welcome bro!",
                "No problem lah!",
                "Anytime, anytime!"
            ]
        }

        # Try to load the model
        self._load_model()

    def _load_model(self):
        """Load the model and tokenizer from Hugging Face."""
        try:
            logger.info("Loading model from Hugging Face...")

            # Determine device
            if settings.device == "auto":
                self.device = 0 if torch.cuda.is_available() else -1  # 0 for first GPU, -1 for CPU
            else:
                self.device = 0 if settings.device == "cuda" and torch.cuda.is_available() else -1

            logger.info(f"Using device: {'CUDA' if self.device >= 0 else 'CPU'}")

            # Create text generation pipeline (simpler approach)
            self.pipeline = pipeline(
                "text-generation",
                model=settings.base_model_name,
                token=settings.hf_token,
                torch_dtype=torch.float16 if self.device >= 0 else torch.float32,
                device=self.device,
                trust_remote_code=True
            )

            self.model_loaded = True
            logger.info("Model loaded successfully!")

        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            logger.warning("Falling back to mock responses")
            self.pipeline = None
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
        """Generate response using the loaded model."""
        if not self.model_loaded or self.pipeline is None:
            raise ValueError("Model not loaded")

        try:
            # Format conversation
            formatted_input = self._format_conversation(message, conversation_history)

            # Generate response
            outputs = self.pipeline(
                formatted_input,
                max_new_tokens=settings.max_new_tokens,
                temperature=settings.temperature,
                top_p=settings.top_p,
                do_sample=settings.do_sample,
                pad_token_id=self.pipeline.tokenizer.eos_token_id,
                eos_token_id=self.pipeline.tokenizer.eos_token_id,
                early_stopping=True,
                return_full_text=False  # Only return the generated part
            )

            response_text = outputs[0]["generated_text"].strip()

            # Clean up memory
            if self.device >= 0:
                torch.cuda.empty_cache()
            gc.collect()

            return response_text

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise ValueError(f"Generation failed: {str(e)}")

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> str:
        """
        Generate a Singlish response based on the input message and conversation history.
        Tries to use the loaded model first, falls back to mock responses.
        """
        if conversation_history is None:
            conversation_history = []

        # Try to use the model if loaded
        if self.model_loaded:
            try:
                return self._generate_with_model(message, conversation_history)
            except Exception as e:
                logger.error(f"Model generation failed, falling back to mock: {str(e)}")

        # Fallback to mock responses
        message_lower = message.lower().strip()

        # Check for simple contextual responses
        if any(greeting in message_lower for greeting in ["hello", "hi", "hey"]):
            return random.choice(self.contextual_responses["greeting"])
        elif any(goodbye in message_lower for goodbye in ["bye", "goodbye", "see you"]):
            return random.choice(self.contextual_responses["goodbye"])
        elif any(thanks in message_lower for thanks in ["thank", "thanks", "appreciate"]):
            return random.choice(self.contextual_responses["thanks"])

        # Add some context awareness based on conversation history
        if conversation_history:
            last_message = conversation_history[-1].content.lower() if conversation_history else ""
            if "price" in message_lower or "cost" in message_lower:
                return "Wah, this one depends on quality lah! Good quality one a bit expensive, but worth it."
            elif "food" in message_lower or "eat" in message_lower:
                return "Shiok! Food in Singapore damn good. You want halal or not?"
            elif "weather" in message_lower:
                return "Weather always hot hot one, better bring umbrella!"

        # Default response with some personality
        return random.choice(self.mock_responses)

    def get_model_status(self) -> Dict[str, Any]:
        """Get the current status of the model service."""
        return {
            "model_loaded": self.model_loaded,
            "device": "CUDA" if self.device >= 0 else "CPU",
            "base_model": settings.base_model_name,
            "adapter_repo": settings.adapter_repo_name,
            "quantization": "none",
            "torch_dtype": "float16" if self.device >= 0 else "float32"
        }

# Singleton instance
model_service = SinglishModelService()