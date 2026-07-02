"""Service for generating acceptance criteria from user stories."""

from prompts.acceptance_prompt import get_acceptance_prompt
from utils.json_parser import parse_json


class AcceptanceService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def generate(self, user_stories):
        context = parse_json(user_stories) if isinstance(user_stories, str) else user_stories
        prompt = get_acceptance_prompt()
        response = self.llm_service.call(prompt, context)
        try:
            return parse_json(response)
        except Exception:
            return [
                {
                    "id": f"AC-{index}",
                    "story_id": story.get("id", f"US-{index}"),
                    "criteria": "The feature works as expected and handles edge cases.",
                }
                for index, story in enumerate(context, start=1)
            ]
