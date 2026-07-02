"""Service for parsing inputs from uploaded documents."""

from __future__ import annotations

import io
import re
import zipfile
from pathlib import Path


class ParserService:
    def parse_bytes(self, file_name: str, content: bytes) -> str:
        ext = Path(file_name).suffix.lower()

        if ext == ".txt":
            return content.decode("utf-8", errors="ignore")

        if ext == ".docx":
            return self._parse_docx(content)

        if ext == ".pdf":
            return self._parse_pdf(content)

        return content.decode("utf-8", errors="ignore")

    def _parse_docx(self, content: bytes) -> str:
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as archive:
                xml_data = archive.read("word/document.xml").decode("utf-8", errors="ignore")
        except Exception:
            return ""

        paragraphs = re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml_data)
        text = " ".join(paragraphs)
        return re.sub(r"\s+", " ", text).strip()

    def _parse_pdf(self, content: bytes) -> str:
        try:
            from PyPDF2 import PdfReader
        except Exception:
            return ""

        try:
            reader = PdfReader(io.BytesIO(content))
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except Exception:
            return ""
