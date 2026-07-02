"""Acceptance criteria data model."""

from dataclasses import dataclass


@dataclass
class AcceptanceCriteria:
    id: str
    user_story_id: str
    criteria: str
