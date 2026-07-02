"""Traceability agent links requirements, test cases, and documentation."""

from services.traceability_service import TraceabilityService


class TraceabilityAgent:
    def __init__(self, traceability_service: TraceabilityService):
        self.traceability_service = traceability_service

    def build_matrix(self, requirements, testcases):
        return {}
