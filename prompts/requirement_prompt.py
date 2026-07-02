"""Prompt templates for requirement generation."""

def get_requirement_prompt():
    return (
        "Extract a JSON array of structured requirements from the raw input below. "
        "Each requirement should include id, title, description, type, priority, and source. "
        "Return only valid JSON."
    )
