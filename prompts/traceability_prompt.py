"""Prompt templates for traceability mapping."""

def get_traceability_prompt():
    return (
        "Create a JSON array of traceability mappings between requirements, user stories, and test cases. "
        "Each mapping should include requirement_id, user_story_id, and testcase_id. "
        "Return only valid JSON."
    )
