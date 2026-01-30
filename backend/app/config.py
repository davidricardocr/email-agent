"""Application configuration."""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App Configuration
    app_name: str = "Email Agent"
    debug: bool = False
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # Server Configuration
    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    # LLM Configuration
    anthropic_api_key: str
    llm_model: str = "claude-3-haiku-20240307"
    llm_temperature: float = 0.7
    llm_max_tokens: int = 4096

    # Email Configuration
    email_address: str
    email_password: str
    imap_server: str = "imap.gmail.com"
    imap_port: int = 993
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    check_interval: int = 60  # seconds

    # LangSmith (optional)
    langchain_tracing_v2: bool = False
    langchain_api_key: str | None = None
    langchain_project: str = "email-agent"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
