"""User story data model."""

from dataclasses import dataclass


@dataclass
class UserStory:
    id: str
    title: str
    as_a: str
    i_want: str
    so_that: str
