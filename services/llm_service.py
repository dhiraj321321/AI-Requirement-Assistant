"""LLM service wrapper for prompt-based calls."""

import json
import os
from dotenv import load_dotenv

import requests

load_dotenv()


class LLMService:
    def __init__(self, api_key=None, model=None):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.model = model or os.getenv("MODEL", "groq")
        self.last_error = None

    def call(self, prompt, input_data):
        content = prompt
        if isinstance(input_data, (dict, list)):
            content += "\n\nInput:\n" + json.dumps(input_data, indent=2)
        else:
            content += "\n\nInput:\n" + str(input_data)

        self.last_error = None
        try:
            if self.model == "groq":
                return self._call_with_fallback(content, primary=self._groq_call, secondary=self._gemini_call)
            if self.model == "gemini":
                return self._call_with_fallback(content, primary=self._gemini_call, secondary=self._groq_call)
            return self._call_with_fallback(content, primary=self._groq_call, secondary=self._gemini_call)
        except Exception as exc:
            self.last_error = exc
            return ""

    def _call_with_fallback(self, content, primary, secondary):
        try:
            return primary(content)
        except Exception as primary_error:
            self.last_error = primary_error
            if secondary is not primary:
                try:
                    return secondary(content)
                except Exception as secondary_error:
                    self.last_error = secondary_error
            return ""

    def _groq_call(self, content):
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY is required to use GROQ. Set it in .env.")
        endpoint = "https://api.groq.com/v1/complete"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.groq_api_key}",
        }
        payload = {
            "model": "groq-1-mini",
            "prompt": content,
            "max_tokens": 1200,
            "temperature": 0.2,
        }
        response = requests.post(endpoint, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict):
            if "text" in data:
                return data["text"].strip()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0].get("text", "").strip()
        return ""

    def _gemini_call(self, content):
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required to use Gemini. Set it in .env.")
        endpoint = "https://gemini.googleapis.com/v1/assistants/text-bison-001:complete"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.gemini_api_key}",
        }
        payload = {
            "prompt": content,
            "temperature": 0.2,
            "maxOutputTokens": 1200,
        }
        response = requests.post(endpoint, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and "candidates" in data and len(data["candidates"]) > 0:
            return data["candidates"][0].get("content", "").strip()
        return ""
