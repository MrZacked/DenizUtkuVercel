"""Build the public resume without personal phone details."""

from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer


OUTPUT = Path(__file__).resolve().parents[1] / "public" / "Deniz_Utku_Ates_Resume.pdf"
BLACK = colors.black


def style(name, font="Helvetica", size=9.2, leading=11.8, after=0, **kwargs):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=BLACK,
        spaceAfter=after,
        **kwargs,
    )


name_style = style("Name", "Helvetica-Bold", 23.5, 25.5, 1.5)
role_style = style("Role", "Helvetica-Bold", 10.3, 12.5, 4)
contact_style = style("Contact", size=9, leading=11.3)
section_style = style("Section", "Helvetica-Bold", 9.3, 11.3, 1)
summary_style = style("Summary", size=9.55, leading=12.5)
job_style = style("Job", size=9.7, leading=11.8)
bullet_style = style(
    "Bullet", size=9.15, leading=11.75, after=2.3, leftIndent=8, firstLineIndent=-8
)
compact_style = style("Compact", after=2.5)
small_style = style("Small", size=8.95, leading=11.1, after=1.3)
stack_style = style("Stack", "Helvetica-Oblique", 8.55, 10.6, 3.2)


def paragraph(text, paragraph_style):
    return Paragraph(text, paragraph_style)


def section(title):
    return [
        Spacer(1, 8.5),
        paragraph(escape(title.upper()), section_style),
        HRFlowable(width="100%", thickness=0.55, color=BLACK, spaceAfter=5.4),
    ]


def job(company, role, dates):
    return paragraph(
        f"<b>{escape(company)}</b> | {escape(role)} | <b>{escape(dates)}</b>",
        job_style,
    )


def bullet(text):
    return paragraph(f"- {escape(text)}", bullet_style)


def metadata(canvas, _doc):
    canvas.setTitle("Deniz Utku Ates - Resume")
    canvas.setAuthor("Deniz Utku Ates")
    canvas.setSubject("Software Developer Resume")


def build():
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=21 * mm,
        rightMargin=21 * mm,
        topMargin=13.5 * mm,
        bottomMargin=12.5 * mm,
        title="Deniz Utku Ates - Resume",
        author="Deniz Utku Ates",
    )

    story = [
        paragraph("DENIZ UTKU ATES", name_style),
        paragraph("SOFTWARE DEVELOPER", role_style),
        paragraph(
            "Antalya, Turkey&nbsp;&nbsp; | &nbsp;&nbsp;"
            '<link href="mailto:denizutku1900@hotmail.com" color="#000000">'
            "denizutku1900@hotmail.com</link>",
            contact_style,
        ),
        paragraph(
            '<link href="https://github.com/MrZacked" color="#000000">github.com/MrZacked</link>'
            "&nbsp;&nbsp; | &nbsp;&nbsp;"
            '<link href="https://denizutkuates.com" color="#000000">denizutkuates.com</link>',
            contact_style,
        ),
    ]

    story += section("Professional Summary")
    story.append(paragraph(
        "Computer Engineering graduate with professional experience building Python services, REST APIs, "
        "data workflows and SaaS integrations. I use FastAPI, Docker, AWS, pytest and GitLab CI/CD in "
        "day-to-day work. My other work includes Django and Node.js apps with SQL and NoSQL databases.",
        summary_style,
    ))

    story += section("Professional Experience")
    story.append(KeepTogether([
        job("VeroDigital", "Python Backend & Integration Developer", "Sep 2025 - Present"),
        paragraph(
            "Python | FastAPI | REST &amp; GraphQL APIs | Docker | AWS | SQL Server/ODBC | pytest | GitLab CI/CD",
            stack_style,
        ),
        bullet(
            "Build Python services, data workflows and SaaS integrations for HR, ERP, accounting and "
            "construction platforms using FastAPI, REST and GraphQL APIs, OAuth, webhooks and SQL/ODBC."
        ),
        bullet(
            "Develop Dockerized backend tools and CLI workflows with data mapping, validation, retries, "
            "duplicate checks, error handling and reporting."
        ),
        bullet(
            "Maintain shared Python components for API clients, configuration, structured logging and parallel "
            "processing. Reuse connection helpers for S3, SMTP and ODBC."
        ),
        bullet(
            "Write unit, API and integration tests with pytest and ship work through GitLab CI/CD in a remote "
            "team using code reviews, documentation and AWS-based workflows."
        ),
    ]))
    story.append(Spacer(1, 3.5))

    story.append(KeepTogether([
        job("Bulutsoft", "Digital Image Processing Intern", "Jan 2024 - Mar 2024"),
        paragraph("Python | PyTorch | TensorFlow | OpenCV | CNNs", stack_style),
        bullet("Trained CNN models with TensorFlow and PyTorch for face recognition and tracking."),
        bullet(
            "Built real-time OpenCV camera pipelines and added them to desktop and web tools for "
            "authentication and attendance."
        ),
    ]))
    story.append(Spacer(1, 2.5))
    story.append(job("Bulutsoft", "Full-Stack Developer Intern", "Jul 2023 - Sep 2023"))
    story.append(bullet(
        "Built React and Node.js features with JWT authentication, REST APIs, MongoDB, Docker and AWS EC2."
    ))

    story += section("Selected Projects")
    story.append(KeepTogether([
        paragraph("<b>Data Processing Service</b> | Python, FastAPI, httpx, pandas, openpyxl", compact_style),
        bullet(
            "Built an async FastAPI service and command-line workflow that combined CSV uploads with "
            "authenticated API data then generated formatted Excel reports. Added parallel metadata lookups, "
            "duplicate removal and a health-check endpoint."
        ),
    ]))
    story.append(paragraph(
        "<b>Healem</b> - Built REST APIs for appointments, messaging and health records with Express and "
        "MongoDB, including JWT access control, input validation and rate limiting. Ran the app with "
        "Docker Compose and added a health endpoint.",
        compact_style,
    ))
    story.append(paragraph(
        "<b>Foodagram</b> - Django app for image and video checks using ResNet50, frame analysis and "
        "similarity scoring.",
        compact_style,
    ))
    story.append(paragraph(
        "<b>Voice Assistant API</b> - FastAPI service for audio uploads and Whisper transcription with "
        "bilingual text and optional speech output. Added input checks, error handling and CPU/GPU fallback.",
        compact_style,
    ))

    story += section("Technical Skills")
    skills = [
        ("Backend Development", "Python, FastAPI, Django, REST APIs, GraphQL, OAuth, JWT, webhooks"),
        ("Data & Automation", "SQL Server, ODBC, MongoDB, pandas, openpyxl, asyncio, CLI tools"),
        ("Testing & Delivery", "pytest, unit/API/integration testing, Docker, Git, GitLab CI/CD, AWS"),
        ("Web", "JavaScript, HTML, CSS, Node.js, React"),
        ("Computer Vision", "PyTorch, TensorFlow, OpenCV, YOLO"),
        ("English", "C1 (IELTS 7.5, 2023)"),
    ]
    for label, values in skills:
        story.append(paragraph(f"<b>{escape(label)}:</b> {escape(values)}", small_style))

    story += section("Education")
    story.append(paragraph(
        "<b>Antalya Bilim University</b> | B.Sc. in Computer Engineering | <b>2021 - 2025</b>",
        compact_style,
    ))
    story.append(paragraph(
        "GPA: 3.76/4.00 | Ranked among the top 3 students in the department",
        small_style,
    ))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story, onFirstPage=metadata, onLaterPages=metadata)
    print(OUTPUT)


if __name__ == "__main__":
    build()
