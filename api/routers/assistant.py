from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from services.llm_service import LLMService
from services.requirement_service import RequirementService
from services.parser_service import ParserService

router = APIRouter()


class PromptRequest(BaseModel):
    prompt: str
    context: str | None = None


class RequirementRequest(BaseModel):
    text: str


@router.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        content = await file.read()
        parsed_text = ParserService().parse_bytes(file.filename or "", content)
        return {
            "filename": file.filename,
            "size": len(content),
            "message": "Upload received",
            "parsed_text": parsed_text,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/llm/query")
async def llm_query(payload: PromptRequest):
    try:
        service = LLMService()
        reply = service.call(payload.prompt, payload.context or "")
        return {"response": reply}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/api/requirements/extract")
async def extract_requirements(payload: RequirementRequest):
    try:
        service = RequirementService(LLMService())
        requirements = service.extract(payload.text)
        return {"requirements": requirements}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
