import io
from pypdf import PdfReader

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts raw text content from uploaded PDF bytes.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        
        full_text = "\n".join(extracted_text).strip()
        if not full_text:
            return "No readable text found in PDF."
        return full_text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")
