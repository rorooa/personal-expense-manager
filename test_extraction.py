import pdfplumber

def test_pdf_extraction(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                print(f"--- Page {i + 1} ---")
                print(text[:1000])  # Print first 1000 characters to avoid clutter
                print("\n" + "-" * 80 + "\n")
            else:
                print(f"Page {i + 1}: No text extracted.")

# Correct path to your PDF
pdf_path = "PhonePe_Statement_Feb2025_Mar2025.pdf"
test_pdf_extraction(pdf_path)
