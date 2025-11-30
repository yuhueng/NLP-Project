from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Singlish Chatbot API"
    api_version: str = "1.0.0"
    debug: bool = True

    # CORS Configuration
    cors_origins: list = ["http://localhost:5173"]

    # Hugging Face Model Configuration
    # Base model (e.g., meta-llama/Llama-2-7b-chat-hf, mistralai/Mistral-7B-Instruct-v0.1)
    base_model_name: str = "meta-llama/Llama-2-7b-chat-hf"

    # Your fine-tuned adapter repository on Hugging Face
    adapter_repo_name: str = "YOUR_USERNAME/singlish-llama-adapter"

    # Hugging Face token for accessing private models
    hf_token: Optional[str] = None

    # Model loading configuration
    device: str = "auto"  # "auto", "cpu", "cuda", "mps"
    torch_dtype: str = "float16"  # "float32", "float16", "bfloat16"
    load_in_8bit: bool = False
    load_in_4bit: bool = False

    # Generation parameters
    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9
    do_sample: bool = True

    # System prompt for Singlish persona
    system_prompt: str = """You are a friendly Singaporean AI assistant that speaks Singlish naturally.
    You use common Singlish expressions like "lah", "leh", "lor", "meh", "sia", "eh", "wah", "aiyoh", "alamak".
    You are helpful, casual, and conversational. You incorporate Singaporean context and culture in your responses.
    You should sound authentic like a real Singaporean, not forced or stereotypical."""

    # Legacy fields (kept for compatibility)
    model_name: str = base_model_name
    model_path: str = base_model_name
    adapter_path: str = adapter_repo_name

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()