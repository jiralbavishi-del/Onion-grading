import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_assessment_pdf(assessment):
    """
    Generates an official APEDA/AGMARK compliant Onion Quality Assessment &
    Grade Certificate as a PDF byte stream.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#781a28'),  # Deep onion tone
        alignment=1,  # Center
    )

    subtitle_style = ParagraphStyle(
        'CertSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#57534e'),
        alignment=1,
    )

    badge_style = ParagraphStyle(
        'CertBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#991b1b'),
        alignment=1,
    )

    label_style = ParagraphStyle(
        'FieldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#292524'),
    )

    value_style = ParagraphStyle(
        'FieldValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#44403c'),
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#781a28'),
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#44403c'),
        alignment=4,  # Justify
    )

    story = []

    # 1. Header & Protocol Badge
    story.append(Paragraph("NATIONAL ONION QUALITY &amp; EXPORT CERTIFICATION", badge_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("ONION GRADING &amp; DEFECT INSPECTION CERTIFICATE", title_style))
    story.append(Paragraph("Standardized Protocol #APEDA-AGMARK-2026 | Government Recognized Quality Benchmark", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#781a28'), spaceAfter=14))

    # 2. Lot & Certification Overview Box
    score_color = '#15803d' if assessment.computed_score >= 85 else ('#b45309' if assessment.computed_score >= 70 else '#b91c1c')
    status_text = f"<b>STATUS: {assessment.quality_status}</b>"

    overview_data = [
        [
            Paragraph("<b>LOT IDENTIFIER:</b>", label_style),
            Paragraph(f"<b>{assessment.lot_id}</b>", value_style),
            Paragraph("<b>AGRONOMIC SCORE:</b>", label_style),
            Paragraph(f"<font color='{score_color}' size='12'><b>{assessment.computed_score} / 100</b></font>", value_style),
        ],
        [
            Paragraph("<b>INSPECTION DATE:</b>", label_style),
            Paragraph(assessment.created_at.strftime("%d %B %Y, %H:%M UTC"), value_style),
            Paragraph("<b>CERTIFICATION RATING:</b>", label_style),
            Paragraph(status_text, value_style),
        ],
    ]

    overview_table = Table(overview_data, colWidths=[120, 140, 130, 130])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fafaf9')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e7e5e4')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#f5f5f4')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(overview_table)
    story.append(Spacer(1, 14))

    # 3. Origin & Traceability Details
    story.append(Paragraph("1. Origin &amp; Cultivar Traceability", section_heading))
    story.append(Spacer(1, 4))

    variety_display = assessment.variety.replace('_', ' ').title()
    trace_data = [
        [
            Paragraph("Supplier / Consignor:", label_style),
            Paragraph(assessment.supplier_name or "N/A", value_style),
            Paragraph("Cultivar Variety:", label_style),
            Paragraph(variety_display, value_style),
        ],
        [
            Paragraph("Contact Phone:", label_style),
            Paragraph(assessment.supplier_phone or "N/A", value_style),
            Paragraph("State of Origin:", label_style),
            Paragraph(assessment.state, value_style),
        ],
        [
            Paragraph("Assigned Grade:", label_style),
            Paragraph(f"<b>{assessment.grade}</b>", value_style),
            Paragraph("Bulb Caliber (Size):", label_style),
            Paragraph(assessment.size_class, value_style),
        ],
        [
            Paragraph("Inspecting Officer:", label_style),
            Paragraph(assessment.inspector_name or "Authorized QC Inspector", value_style),
            Paragraph("Attached Photos:", label_style),
            Paragraph(f"{assessment.images.count()} specimen(s) logged", value_style),
        ],
    ]

    trace_table = Table(trace_data, colWidths=[120, 140, 120, 140])
    trace_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#e7e5e4')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(trace_table)
    story.append(Spacer(1, 14))

    # 4. Defect Telemetry & Tolerances
    story.append(Paragraph("2. Telemetry &amp; Defect Quantification (APEDA Standard)", section_heading))
    story.append(Spacer(1, 4))

    telemetry_data = [
        [
            Paragraph("<b>Parameter</b>", label_style),
            Paragraph("<b>Tested Reading</b>", label_style),
            Paragraph("<b>Tolerance Benchmark</b>", label_style),
            Paragraph("<b>Defect Impact</b>", label_style),
        ],
        [
            Paragraph("Moisture Content", value_style),
            Paragraph(f"<b>{assessment.moisture:.1f}%</b>", value_style),
            Paragraph("12.0% - 14.0% Optimal", value_style),
            Paragraph("Normal" if assessment.moisture <= 14.0 else f"+{((assessment.moisture - 14) * 4):.1f} penalty pts", value_style),
        ],
        [
            Paragraph("Sprouting Rate", value_style),
            Paragraph(f"<b>{assessment.sprouting:.1f}%</b>", value_style),
            Paragraph("Max 5.0% Export", value_style),
            Paragraph("Optimal" if assessment.sprouting <= 5.0 else "High Sprout Risk", value_style),
        ],
        [
            Paragraph("Mechanical Damage &amp; Cuts", value_style),
            Paragraph(f"<b>{assessment.damage:.1f}%</b>", value_style),
            Paragraph("Max 3.0% Clean", value_style),
            Paragraph("Acceptable" if assessment.damage <= 3.0 else "Elevated Blemish", value_style),
        ],
        [
            Paragraph("Doubles &amp; Split Bulbs", value_style),
            Paragraph(f"<b>{assessment.doubles:.1f}%</b>", value_style),
            Paragraph("Max 4.0% Standard", value_style),
            Paragraph("Passed" if assessment.doubles <= 4.0 else "Conjoined Deviation", value_style),
        ],
    ]

    telemetry_table = Table(telemetry_data, colWidths=[150, 100, 140, 130])
    telemetry_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f5f5f4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#d6d3d1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e7e5e4')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(telemetry_table)
    story.append(Spacer(1, 14))

    # 5. Expert Analysis & Notes
    story.append(Paragraph("3. Expert Quality Advisory &amp; Field Notes", section_heading))
    story.append(Spacer(1, 4))

    default_analysis = (
        "Based on the comprehensive telemetry and visual defect tolerance data gathered, "
        f"this lot exhibits characteristics compliant with {assessment.grade} specifications. "
        "Moisture regulation and proper container aeration are recommended during transit to inhibit latent sprouting."
    )
    opinion_text = assessment.notes.strip() if assessment.notes.strip() else default_analysis

    opinion_data = [[Paragraph(opinion_text, body_style)]]
    opinion_table = Table(opinion_data, colWidths=[520])
    opinion_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fafaf9')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#e7e5e4')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(opinion_table)
    story.append(Spacer(1, 24))

    # 6. Signatures & QR/Seal Area
    sig_data = [
        [
            Paragraph("<b>Inspected &amp; Certified By:</b><br/><br/>___________________________<br/>" + (assessment.inspector_name or "QC Certification Officer"), value_style),
            Paragraph("<b>Packhouse Authority:</b><br/><br/>___________________________<br/>Seal &amp; Signature", value_style),
            Paragraph("<b>Certificate Security:</b><br/><br/>System Generated Document<br/>Traceability Validated", value_style),
        ]
    ]
    sig_table = Table(sig_data, colWidths=[180, 170, 170])
    sig_table.setStyle(TableStyle([
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(sig_table)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
