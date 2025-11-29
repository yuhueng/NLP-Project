from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Singlish Chatbot API"
    api_version: str = "1.0.0"
    debug: bool = True

    # CORS Configuration
    cors_origins: list = ["http://localhost:5173"]

    # Model Configuration (placeholder for future use)
    model_name: str = "placeholder"
    model_path: str = ""
    adapter_path: str = ""

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()