"""Test case data model."""

from dataclasses import dataclass


@dataclass
class TestCase:
    id: str
    requirement_id: str
    description: str
    steps: list
    expected_result: str
