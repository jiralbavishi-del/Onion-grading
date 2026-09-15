import uuid
from django.db import models
from django.utils import timezone


def calculate_quality_metrics(moisture, sprouting, damage, doubles):
    """
    Computes APEDA/AGMARK compliant quality score and certification status.
    """
    m = float(moisture or 0)
    s = float(sprouting or 0)
    d = float(damage or 0)
    db = float(doubles or 0)

    moisture_penalty = (m - 14.0) * 4.0 if m > 14.0 else 0.0
    sprouting_penalty = s * 2.5
    damage_penalty = d * 1.5
    doubles_penalty = db * 1.0

    raw_score = 100.0 - (moisture_penalty + sprouting_penalty + damage_penalty + doubles_penalty)
    score = max(0, min(100, round(raw_score)))

    if score >= 85:
        status = 'CERTIFIED'
    elif score >= 70:
        status = 'STANDARD'
    elif score >= 50:
        status = 'CONDITIONAL'
    else:
        status = 'REJECTED'

    return score, status


class OnionVariety(models.Model):
    code = models.CharField(max_length=64, unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    variety_type = models.CharField(max_length=255, default='Rabi / Storage')
    origin = models.CharField(max_length=255)
    characteristics = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='varieties/', blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, default='')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Onion Variety'
        verbose_name_plural = 'Onion Varieties'

    def __str__(self):
        return f"{self.name} ({self.code})"


class DefectReferenceSample(models.Model):
    sample_id = models.CharField(max_length=64, unique=True, primary_key=True)
    title = models.CharField(max_length=255)
    tag = models.CharField(max_length=100)
    class_tag = models.CharField(max_length=100)
    tag_bg = models.CharField(max_length=255, default='bg-rose-950/85 text-rose-200 border-rose-700')
    badge_bg = models.CharField(max_length=255, default='bg-amber-900/85 text-amber-200 border-amber-700')
    image = models.ImageField(upload_to='samples/', blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True, default='')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Defect Reference Sample'
        verbose_name_plural = 'Defect Reference Samples'

    def __str__(self):
        return f"{self.title} ({self.sample_id})"


class Assessment(models.Model):
    GRADE_CHOICES = [
        ('Grade A', 'Grade A (Export Benchmark)'),
        ('Grade B', 'Grade B (Standard Market)'),
        ('Grade C', 'Grade C (Secondary Quality)'),
        ('Reject', 'Reject (Sub-standard)'),
    ]

    SIZE_CLASS_CHOICES = [
        ('Small', 'Small (< 40mm)'),
        ('Medium', 'Medium (40-60mm)'),
        ('Large', 'Large (60-80mm)'),
        ('Extra Large', 'Extra Large (> 80mm)'),
    ]

    STATUS_CHOICES = [
        ('CERTIFIED', 'Certified'),
        ('STANDARD', 'Standard'),
        ('CONDITIONAL', 'Conditional'),
        ('REJECTED', 'Rejected'),
    ]

    # Primary identification & Lot tracking
    lot_id = models.CharField(max_length=64, unique=True, db_index=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Origin & Traceability
    supplier_name = models.CharField(max_length=255)
    supplier_phone = models.CharField(max_length=50)
    state = models.CharField(max_length=100, default='Maharashtra')
    variety = models.CharField(max_length=100, default='nashik_red')

    # Calibration & Specifications
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES, default='Grade A')
    size_class = models.CharField(max_length=30, choices=SIZE_CLASS_CHOICES, default='Medium')

    # Telemetry / Defect Percentages
    moisture = models.FloatField(default=12.0, help_text='Moisture content percentage')
    sprouting = models.FloatField(default=0.0, help_text='Sprouting rate percentage')
    damage = models.FloatField(default=0.0, help_text='Mechanical cuts & damage percentage')
    doubles = models.FloatField(default=0.0, help_text='Doubles and split bulb percentage')

    # Inspector Sign-off
    inspector_name = models.CharField(max_length=255, blank=True, default='')
    notes = models.TextField(blank=True, default='')

    # Synthesized Outputs
    computed_score = models.IntegerField(default=100)
    quality_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='CERTIFIED')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Onion Assessment'
        verbose_name_plural = 'Onion Assessments'

    def save(self, *args, **kwargs):
        if not self.lot_id:
            self.lot_id = f"IN-ONION-{uuid.uuid4().hex[:6].upper()}"

        # Recalculate metrics on save
        score, status = calculate_quality_metrics(
            self.moisture, self.sprouting, self.damage, self.doubles
        )
        self.computed_score = score
        self.quality_status = status

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lot_id} - {self.supplier_name} ({self.grade}, Score: {self.computed_score})"


class AssessmentImage(models.Model):
    assessment = models.ForeignKey(
        Assessment, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to='assessments/%Y/%m/')
    filename = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def save(self, *args, **kwargs):
        if not self.filename and self.image:
            self.filename = self.image.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.assessment.lot_id} ({self.filename})"
