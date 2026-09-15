from django.http import HttpResponse
from django.db.models import Avg, Count, Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Assessment, OnionVariety, DefectReferenceSample
from .serializers import (
    AssessmentSerializer,
    OnionVarietySerializer,
    DefectReferenceSampleSerializer,
)
from .pdf_generator import generate_assessment_pdf


class OnionVarietyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns verified Indian onion varieties with high-res specimen photos and origin data.
    """
    queryset = OnionVariety.objects.all()
    serializer_class = OnionVarietySerializer
    pagination_class = None


class DefectReferenceSampleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns authentic defect reference intake specimens with tags and classification overlays.
    """
    queryset = DefectReferenceSample.objects.all()
    serializer_class = DefectReferenceSampleSerializer
    pagination_class = None



PRODUCING_STATES = [
    "Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Rajasthan",
    "Bihar", "Andhra Pradesh", "Telangana", "Haryana", "Uttar Pradesh",
    "West Bengal", "Tamil Nadu", "Odisha", "Punjab",
]

GRADES_CONFIG = [
    {
        "id": "Grade A",
        "label": "Grade A",
        "badge": "Premium Export",
        "tag": "Premium",
        "color": "onion",
        "description": "Uniform shape, tight neck, cured skin, total defects ≤ 5%",
        "desc": "Uniform bulbs, firm, minimal defects",
        "maxDefectTotal": 5,
    },
    {
        "id": "Grade B",
        "label": "Grade B",
        "badge": "Domestic Standard",
        "tag": "Standard",
        "color": "amber",
        "description": "Acceptable uniformity, slight skin shedding, defects ≤ 10%",
        "desc": "Fair uniformity, moderate defects",
        "maxDefectTotal": 10,
    },
    {
        "id": "Grade C",
        "label": "Grade C",
        "badge": "Discount / Local",
        "tag": "Processing",
        "color": "rose",
        "description": "Varied caliber, moderate cuts, bolters allowed, defects ≤ 20%",
        "desc": "Irregular size, high defect tolerance",
        "maxDefectTotal": 20,
    },
    {
        "id": "Reject",
        "label": "Reject / Culled",
        "badge": "Sub-standard",
        "tag": "Reject",
        "color": "stone",
        "description": "Severe rot, heavy sprouting > 12%, unsellable commercial stock",
        "desc": "Severe decay or defect load exceeding threshold",
        "maxDefectTotal": 100,
    },
]

SIZE_CLASSES_CONFIG = [
    {"id": "Small", "label": "Small (S)", "range": "< 35 mm", "caliber": "< 35 mm", "circleDiameter": 30, "mmMin": "30", "purpose": "Pickling & domestic soup"},
    {"id": "Medium", "label": "Medium (M)", "range": "35–55 mm", "caliber": "35–55 mm", "circleDiameter": 42, "mmMin": "45", "purpose": "Standard household & retail"},
    {"id": "Large", "label": "Large (L)", "range": "55–70 mm", "caliber": "55–70 mm", "circleDiameter": 54, "mmMin": "60", "purpose": "Commercial catering & slicing"},
    {"id": "Jumbo", "label": "Jumbo (XL)", "range": "> 70 mm", "caliber": "> 70 mm", "circleDiameter": 66, "mmMin": "75", "purpose": "Premium export & processing"},
]


class MetadataView(APIView):
    """
    Returns complete master configuration and reference specimens:
    States, Grades, Sizes, Onion Varieties, and Defect Reference Intake samples.
    """
    def get(self, request):
        varieties = OnionVariety.objects.all()
        defect_samples = DefectReferenceSample.objects.all()

        var_serializer = OnionVarietySerializer(varieties, many=True, context={'request': request})
        defect_serializer = DefectReferenceSampleSerializer(defect_samples, many=True, context={'request': request})

        return Response({
            'states': PRODUCING_STATES,
            'grades': GRADES_CONFIG,
            'sizeClasses': SIZE_CLASSES_CONFIG,
            'varieties': var_serializer.data,
            'defectSamples': defect_serializer.data,
        }, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    """
    Health check endpoint to verify backend operational readiness.
    """
    def get(self, request):
        return Response({
            'status': 'healthy',
            'service': 'Onion Grading DRF Backend',
            'version': '1.0.0',
            'protocol': 'APEDA-AGMARK-2026',
        }, status=status.HTTP_200_OK)


class AssessmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet providing full CRUD operations, PDF certificate export,
    and statistical analytics for Onion Quality Assessments.
    """
    queryset = Assessment.objects.prefetch_related('images').all()
    serializer_class = AssessmentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = super().get_queryset()
        grade = self.request.query_params.get('grade')
        variety = self.request.query_params.get('variety')
        status_val = self.request.query_params.get('status')
        state = self.request.query_params.get('state')
        search = self.request.query_params.get('search')

        if grade:
            qs = qs.filter(grade__iexact=grade)
        if variety:
            qs = qs.filter(variety__iexact=variety)
        if status_val:
            qs = qs.filter(quality_status__iexact=status_val)
        if state:
            qs = qs.filter(state__icontains=state)
        if search:
            qs = qs.filter(
                models.Q(lot_id__icontains=search) |
                models.Q(supplier_name__icontains=search) |
                models.Q(inspector_name__icontains=search)
            )

        return qs

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """
        Exports an official APEDA/AGMARK PDF Quality Certificate for this lot.
        """
        assessment = self.get_object()
        pdf_bytes = generate_assessment_pdf(assessment)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        filename = f"Certificate-{assessment.lot_id}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['X-Filename'] = filename
        response['Access-Control-Expose-Headers'] = 'Content-Disposition, X-Filename'
        return response

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Returns high-level quality analytics and distribution statistics across all lots.
        """
        total_count = Assessment.objects.count()
        if total_count == 0:
            return Response({
                'totalAssessments': 0,
                'averageScore': 0,
                'gradeBreakdown': {},
                'statusBreakdown': {},
                'topVarieties': [],
            })

        avg_score = Assessment.objects.aggregate(avg=Avg('computed_score'))['avg'] or 0

        grade_counts = dict(
            Assessment.objects.values('grade')
            .annotate(count=Count('id'))
            .values_list('grade', 'count')
        )

        status_counts = dict(
            Assessment.objects.values('quality_status')
            .annotate(count=Count('id'))
            .values_list('quality_status', 'count')
        )

        variety_counts = list(
            Assessment.objects.values('variety')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        return Response({
            'totalAssessments': total_count,
            'averageScore': round(avg_score, 1),
            'gradeBreakdown': grade_counts,
            'statusBreakdown': status_counts,
            'topVarieties': variety_counts,
        })
