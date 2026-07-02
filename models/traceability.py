"""Traceability relationship data model."""

from dataclasses import dataclass


@dataclass
class TraceabilityLink:
    requirement_id: str
    testcase_id: str
    status: str
