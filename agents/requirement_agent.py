"""Requirement agent orchestrates requirement extraction and validation."""

from services.llm_service import LLMService


class RequirementAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service

    def generate_requirements(self, documents):
        """Generate structured requirements from source documents."""
        return []
