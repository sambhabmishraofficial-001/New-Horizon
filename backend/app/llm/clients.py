from __future__ import annotations

import json
import re
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config import Settings


class ModelConfigurationError(RuntimeError):
    pass


class OpenAIModelClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        if settings.model_provider != "openai":
            raise ModelConfigurationError(
                f"Unsupported MODEL_PROVIDER '{settings.model_provider}'. Use 'openai'."
            )
        if not settings.openai_api_key.strip():
            raise ModelConfigurationError("OPENAI_API_KEY is required to run investigations.")

        self.llm = ChatOpenAI(
            api_key=settings.openai_api_key,
            model=settings.openai_model,
            temperature=settings.openai_temperature,
        )

    async def generate_json(self, system_prompt: str, user_prompt: str) -> dict[str, Any]:
        response = await self.llm.ainvoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ]
        )
        content = self._stringify_content(response.content)
        return self._parse_json(content)

    @staticmethod
    def _stringify_content(content: Any) -> str:
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            parts: list[str] = []
            for item in content:
                if isinstance(item, dict):
                    parts.append(str(item.get("text") or item.get("content") or item))
                else:
                    parts.append(str(item))
            return "\n".join(parts)
        return str(content)

    @staticmethod
    def _parse_json(content: str) -> dict[str, Any]:
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, flags=re.DOTALL)
            if not match:
                raise ValueError("Model response did not contain a JSON object.")
            parsed = json.loads(match.group(0))

        if not isinstance(parsed, dict):
            raise ValueError("Model response JSON must be an object.")
        return parsed


def model_configured(settings: Settings) -> bool:
    return settings.model_provider == "openai" and bool(settings.openai_api_key.strip())


def get_model_client(settings: Settings) -> OpenAIModelClient:
    return OpenAIModelClient(settings)
