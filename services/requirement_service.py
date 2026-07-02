"""Service for managing requirement logic."""

import json
import re
from prompts.requirement_prompt import get_requirement_prompt
from utils.json_parser import parse_json


class RequirementService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def extract(self, text):
        raw_text = text if isinstance(text, str) else str(text)
        prompt = get_requirement_prompt()
        response = self.llm_service.call(prompt, raw_text)

        requirements = []
        if response:
            try:
                requirements = parse_json(response)
            except Exception:
                requirements = []

        if not requirements:
            requirements = self._fallback_extract(raw_text)

        return requirements

    def _fallback_extract(self, raw_text):
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        if not lines:
            return []

        bullets = []
        for line in lines:
            cleaned = re.sub(r"^[-*\d\.\)]+\s*", "", line)
            if cleaned:
                bullets.append(cleaned)

        requirements = []
        for index, bullet in enumerate(bullets, start=1):
            if index > 12:
                break
            requirements.append(
                {
                    "id": f"REQ-{index}",
                    "title": bullet[:80],
                    "description": bullet,
                    "type": "Functional" if "user" in bullet.lower() or "must" in bullet.lower() else "Non-functional",
                    "priority": "Medium",
                }
            )

        return requirements
