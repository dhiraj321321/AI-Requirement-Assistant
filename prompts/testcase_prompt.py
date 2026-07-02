"""Prompt templates for test case generation."""

def get_testcase_prompt():
    return (
        "Generate a JSON array of test cases for the structured requirements below. "
        "Each test case should include id, requirement_id, description, steps, expected_result. "
        "Return only valid JSON."
    )
