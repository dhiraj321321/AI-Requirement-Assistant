"""Quality agent evaluates requirements and acceptance criteria."""

from services.quality_service import QualityService


class QualityAgent:
    def __init__(self, quality_service: QualityService):
        self.quality_service = quality_service

    def assess_quality(self, requirements):
        return []
