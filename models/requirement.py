"""Requirement data model."""

from dataclasses import dataclass


@dataclass
class Requirement:
    id: str
    title: str
    description: str
    type: str
