"""Service for evaluating quality and compliance."""

from prompts.quality_prompt import get_quality_prompt
from utils.json_parser import parse_json


class QualityService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def evaluate(self, requirements):
        prompt = get_quality_prompt()
        response = self.llm_service.call(prompt, requirements)

        if response:
            try:
                return parse_json(response)
            except Exception:
                pass

        return [
            {
                "id": "QC-1",
                "issue_type": "Gap",
                "detail": "Review requirements for missing edge case coverage and unclear acceptance details.",
                "recommendation": "Clarify user roles, success criteria, and error handling.",
            }
        ]
