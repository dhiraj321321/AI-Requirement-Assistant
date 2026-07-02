"""Prompt templates for acceptance criteria generation."""

def get_acceptance_prompt():
    return (
        "Generate a JSON array of acceptance criteria for each user story given below. "
        "Include happy path, edge cases, and negative scenarios for each story. "
        "Return only valid JSON with fields id, story_id, criteria."
    )
