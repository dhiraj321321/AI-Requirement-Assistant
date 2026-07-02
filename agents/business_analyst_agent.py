"""Business analyst agent provides domain analysis and requirement refinement."""

from services.requirement_service import RequirementService


class BusinessAnalystAgent:
    def __init__(self, requirement_service: RequirementService):
        self.requirement_service = requirement_service

    def analyze(self, requirement_text):
        return {}
