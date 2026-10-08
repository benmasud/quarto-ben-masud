"""Build the downloadable CV from cv/index.qmd. Requires reportlab."""
from html import escape
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Spacer

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "files" / "cv-rofikul-masud.pdf"
TEAL = colors.HexColor("#176c72")
GREY = colors.HexColor("#566260")
BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=13,
                      spaceAfter=4, textColor=colors.HexColor("#252b2b"))
SECTION = ParagraphStyle("section", parent=BODY, fontName="Helvetica-Bold", fontSize=11,
                         leading=14, textColor=TEAL, spaceBefore=11, spaceAfter=5, keepWithNext=True)
ROLE = ParagraphStyle("role", parent=BODY, fontName="Helvetica-Bold", fontSize=10,
                      leading=13, spaceBefore=7, spaceAfter=2, keepWithNext=True)
ORG = ParagraphStyle("org", parent=BODY, fontSize=9.5, leading=12, spaceAfter=2, keepWithNext=True)
META = ParagraphStyle("meta", parent=BODY, fontSize=9, leading=12, textColor=GREY, spaceAfter=4)
BULLET = ParagraphStyle("bullet", parent=BODY, leftIndent=9, firstLineIndent=-9, spaceAfter=3)


def inline(text):
    """Translate the simple Markdown used by this CV into ReportLab markup."""
    text = escape(text.replace("–", "-").replace("—", "-"))
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" color="#176c72">\1</a>', text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    return re.sub(r"\*([^*]+)\*", r"<i>\1</i>", text)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#dce5e2"))
    canvas.line(44, 38, A4[0] - 44, 38)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawString(44, 25, "Rofikul Masud | 8 October 2026")
    canvas.drawRightString(A4[0] - 44, 25, str(doc.page))
    canvas.restoreState()


def build():
    source = (ROOT / "cv" / "index.qmd").read_text(encoding="utf-8")
    content = source.split("---", 2)[2].strip()
    story = []
    for block in re.split(r"\n\s*\n", content):
        block = block.strip()
        if block.startswith("[Download CV") or block.startswith("*Updated "):
            continue
        if block.startswith("**Rofikul Masud**"):
            story.append(Paragraph("ROFIKUL MASUD", ParagraphStyle("name", parent=BODY,
                fontName="Helvetica-Bold", fontSize=21, leading=25, spaceAfter=5)))
            story.append(Paragraph("Bonn, Germany", META))
        elif block.startswith("### "):
            story.append(Paragraph(inline(block[4:]), ROLE))
        elif block.startswith("## "):
            if block == "## Research experience":
                story.append(PageBreak())
            story.append(Paragraph(inline(block[3:].upper()), SECTION))
        elif block.startswith("- "):
            for item in block.splitlines():
                story.append(Paragraph("- " + inline(item.removeprefix("- ")), BULLET))
        else:
            style = BODY
            if re.fullmatch(r"\*\*.+\*\*", block):
                style = ORG
            elif re.match(r"^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}", block):
                style = META
            story.append(Paragraph(inline(block), style))
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
                            topMargin=38, bottomMargin=49, title="Rofikul Masud - Curriculum vitae",
                            author="Rofikul Masud", subject="Resume updated 8 October 2026")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
