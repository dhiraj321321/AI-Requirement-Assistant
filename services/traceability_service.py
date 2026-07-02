"""Service for creating traceability relationships."""

import json
from prompts.traceability_prompt import get_traceability_prompt
from utils.json_parser import parse_json


class TraceabilityService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def map(self, requirements, user_stories, testcases):
        prompt = get_traceability_prompt()
        payload = {
            "requirements": requirements,
            "user_stories": user_stories,
            "testcases": testcases,
        }
        response = self.llm_service.call(prompt, payload)

        if response:
            try:
                return parse_json(response)
            except Exception:
                pass

        mappings = []
        for req, story, testcase in zip(requirements, user_stories, testcases):
            mappings.append(
                {
                    "requirement_id": req.get("id"),
                    "user_story_id": story.get("id"),
                    "testcase_id": testcase.get("id"),
                }
            )
        return mappings
