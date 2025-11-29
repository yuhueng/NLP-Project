from app.models.schemas import ChatMessage, MessageRole
from typing import List
import random
from datetime import datetime

class SinglishModelService:
    """
    Placeholder model service for Singlish chatbot.
    Returns mock Singlish responses for MVP.
    Ready for integration with actual fine-tuned model.
    """

    def __init__(self):
        # Mock Singlish responses for common patterns
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

    def generate_response(self, message: str, conversation_history: List[ChatMessage] = None) -> str:
        """
        Generate a Singlish response based on the input message and conversation history.
        """
        if conversation_history is None:
            conversation_history = []

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

# Singleton instance
model_service = SinglishModelService()