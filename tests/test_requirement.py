from io import BytesIO
import zipfile

from services.parser_service import ParserService
from services.requirement_service import RequirementService


class EmptyLLMService:
    def call(self, prompt, input_data):
        return ""


def build_docx_bytes(paragraphs):
    document_xml = """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
  <w:body>
    {paragraphs}
  </w:body>
</w:document>"""
    paragraph_xml = "".join(
        f"<w:p><w:r><w:t>{paragraph}</w:t></w:r></w:p>" for paragraph in paragraphs
    )
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("word/document.xml", document_xml.format(paragraphs=paragraph_xml))
    return buffer.getvalue()


def test_docx_paragraphs_are_preserved_for_requirement_extraction():
    parser = ParserService()
    docx_bytes = build_docx_bytes([
        "The HR department wants employees to submit feedback anonymously.",
        "HR should be able to review all feedback and generate monthly reports.",
    ])

    parsed_text = parser.parse_bytes("sample.docx", docx_bytes)

    assert "\n" in parsed_text

    requirements = RequirementService(EmptyLLMService()).extract(parsed_text)

    assert len(requirements) >= 2
    assert requirements[0]["title"] == "The HR department wants employees to submit feedback anonymously."
    assert requirements[1]["title"] == "HR should be able to review all feedback and generate monthly reports."
