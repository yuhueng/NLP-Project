from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List
from pydantic import field_validator

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Singlish Chatbot API"
    api_version: str = "1.0.0"
    debug: bool = True

    # CORS Configuration - use str to avoid JSON parsing issues
    cors_origins: str = "http://localhost:5173"

    @field_validator('cors_origins', mode='after')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            # Split by comma and clean up
            origins = [origin.strip() for origin in v.split(',') if origin.strip()]
            return origins
        return v if v else ["http://localhost:5173"]

    # Hugging Face Model Configuration
    # Base model (e.g., meta-llama/Llama-2-7b-chat-hf, mistralai/Mistral-7B-Instruct-v0.1)
    base_model_name: str = "yuhueng/qwen3-4b-singlish-base"

    # Your fine-tuned adapter repository on Hugging Face (set to None if not trained yet)
    adapter_repo_name: Optional[str] = None

    # Hugging Face token for accessing private models
    # You can set this as environment variable: HF_TOKEN=your_token_here
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
    adapter_path: Optional[str] = None  # Will be set if adapter_repo_name is provided

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=('settings_',),
        case_sensitive=False
    )

settings = Settings()