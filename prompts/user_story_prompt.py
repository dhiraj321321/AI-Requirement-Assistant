"""Prompt templates for user story generation."""

def get_user_story_prompt():
    return (
        "Convert the structured requirements below into a JSON array of user stories. "
        "Each story should follow the format: As a <user>, I want <feature> so that <benefit>. "
        "Return only valid JSON with fields id, requirement_id, as_a, i_want, so_that."
    )
