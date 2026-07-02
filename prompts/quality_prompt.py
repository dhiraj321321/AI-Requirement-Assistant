"""Prompt templates for quality evaluation."""

def get_quality_prompt():
    return (
        "Analyze the structured requirements below and return a JSON array of quality findings. "
        "Each finding should include id, issue_type, detail, and recommendation. "
        "Issue types can include Ambiguity, Missing Information, or Conflict. "
        "Return only valid JSON."
    )
