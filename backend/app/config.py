from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    database_url: str = "postgresql+psycopg://vri:vri@localhost:5432/vri"

    model_provider: str = "openai"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_temperature: float = 0.2

    langsmith_tracing: bool = False
    langsmith_api_key: str = ""

    cors_origins: str = Field(
        default="http://localhost:4000,http://127.0.0.1:4000"
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def openai_configured(self) -> bool:
        return self.model_provider == "openai" and bool(self.openai_api_key.strip())


@lru_cache
def get_settings() -> Settings:
    return Settings()
