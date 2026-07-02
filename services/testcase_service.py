"""Service for generating test case artifacts."""

from prompts.testcase_prompt import get_testcase_prompt
from utils.json_parser import parse_json


class TestcaseService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def generate(self, requirements):
        prompt = get_testcase_prompt()
        response = self.llm_service.call(prompt, requirements)

        if response:
            try:
                return parse_json(response)
            except Exception:
                pass

        testcases = []
        for index, req in enumerate(requirements, start=1):
            testcases.append(
                {
                    "id": f"TC-{index}",
                    "requirement_id": req.get("id", f"REQ-{index}"),
                    "description": f"Validate requirement {req.get('title', 'Unnamed requirement')}",
                    "steps": [
                        "Open the application",
                        "Execute the scenario described in the requirement",
                        "Verify the expected result"
                    ],
                    "expected_result": "The feature behaves as described in the requirement.",
                }
            )

        return testcases
