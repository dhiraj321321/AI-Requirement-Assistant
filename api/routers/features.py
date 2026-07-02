"""Routes for generating all requirement artifacts."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import LLMService
from services.requirement_service import RequirementService
from services.user_story_service import UserStoryService
from services.acceptance_service import AcceptanceService
from services.testcase_service import TestcaseService
from services.quality_service import QualityService
from services.traceability_service import TraceabilityService

router = APIRouter()


class TextRequest(BaseModel):
    text: str


class ExportRequest(BaseModel):
    requirements: list = []
    user_stories: list = []
    acceptance_criteria: list = []
    testcases: list = []
    quality_findings: list = []
    traceability: list = []


@router.post("/api/features/user-stories")
async def generate_user_stories(payload: TextRequest):
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        user_story_service = UserStoryService(llm_service)

        requirements = requirement_service.extract(payload.text)
        user_stories = user_story_service.generate(requirements)
        return {"user_stories": user_stories, "requirements": requirements}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/acceptance-criteria")
async def generate_acceptance_criteria(payload: TextRequest):
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        user_story_service = UserStoryService(llm_service)
        acceptance_service = AcceptanceService(llm_service)

        requirements = requirement_service.extract(payload.text)
        user_stories = user_story_service.generate(requirements)
        acceptance_criteria = acceptance_service.generate(user_stories)
        return {
            "acceptance_criteria": acceptance_criteria,
            "user_stories": user_stories,
            "requirements": requirements,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/test-cases")
async def generate_test_cases(payload: TextRequest):
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        testcase_service = TestcaseService(llm_service)

        requirements = requirement_service.extract(payload.text)
        testcases = testcase_service.generate(requirements)
        return {"testcases": testcases, "requirements": requirements}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/quality")
async def evaluate_quality(payload: TextRequest):
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        quality_service = QualityService(llm_service)

        requirements = requirement_service.extract(payload.text)
        quality_findings = quality_service.evaluate(requirements)
        return {"quality_findings": quality_findings, "requirements": requirements}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/traceability")
async def build_traceability_matrix(payload: TextRequest):
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        user_story_service = UserStoryService(llm_service)
        testcase_service = TestcaseService(llm_service)
        traceability_service = TraceabilityService(llm_service)

        requirements = requirement_service.extract(payload.text)
        user_stories = user_story_service.generate(requirements)
        testcases = testcase_service.generate(requirements)
        traceability_matrix = traceability_service.map(requirements, user_stories, testcases)

        return {
            "traceability_matrix": traceability_matrix,
            "requirements": requirements,
            "user_stories": user_stories,
            "testcases": testcases,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/full-workflow")
async def run_full_workflow(payload: TextRequest):
    """Run complete pipeline: requirements -> user stories -> acceptance -> tests -> quality -> traceability."""
    try:
        llm_service = LLMService()
        requirement_service = RequirementService(llm_service)
        user_story_service = UserStoryService(llm_service)
        acceptance_service = AcceptanceService(llm_service)
        testcase_service = TestcaseService(llm_service)
        quality_service = QualityService(llm_service)
        traceability_service = TraceabilityService(llm_service)

        # Pipeline
        requirements = requirement_service.extract(payload.text)
        user_stories = user_story_service.generate(requirements)
        acceptance_criteria = acceptance_service.generate(user_stories)
        testcases = testcase_service.generate(requirements)
        quality_findings = quality_service.evaluate(requirements)
        traceability_matrix = traceability_service.map(requirements, user_stories, testcases)

        return {
            "requirements": requirements,
            "user_stories": user_stories,
            "acceptance_criteria": acceptance_criteria,
            "testcases": testcases,
            "quality_findings": quality_findings,
            "traceability_matrix": traceability_matrix,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/features/export")
async def export_artifacts(payload: ExportRequest):
    """Export all artifacts as JSON. Can be extended to support Word/PDF/Excel."""
    try:
        return {
            "format": "json",
            "data": {
                "requirements": payload.requirements,
                "user_stories": payload.user_stories,
                "acceptance_criteria": payload.acceptance_criteria,
                "testcases": payload.testcases,
                "quality_findings": payload.quality_findings,
                "traceability": payload.traceability,
            },
            "message": "Export ready. Use downloaded JSON file or integrate with Word/PDF/Excel.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
