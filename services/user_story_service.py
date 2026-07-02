"""Service for generating user stories from requirements."""

from prompts.user_story_prompt import get_user_story_prompt
from utils.json_parser import parse_json


class UserStoryService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def generate(self, requirements):
        context = parse_json(requirements) if isinstance(requirements, str) else requirements
        prompt = get_user_story_prompt()
        response = self.llm_service.call(prompt, context)
        try:
            stories = parse_json(response)
        except Exception:
            stories = []
            for index, rq in enumerate(context, start=1):
                stories.append(
                    {
                        "id": f"US-{index}",
                        "requirement_id": rq.get("id", f"REQ-{index}"),
                        "as_a": "User",
                        "i_want": rq.get("title", "Access the feature"),
                        "so_that": "I can achieve the desired outcome.",
                    }
                )
        return stories
