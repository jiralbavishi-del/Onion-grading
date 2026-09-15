from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssessmentViewSet,
    OnionVarietyViewSet,
    DefectReferenceSampleViewSet,
    MetadataView,
    HealthCheckView,
)

router = DefaultRouter()
router.register(r'assessments', AssessmentViewSet, basename='assessment')
router.register(r'varieties', OnionVarietyViewSet, basename='variety')
router.register(r'defect-samples', DefectReferenceSampleViewSet, basename='defect-sample')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('meta/', MetadataView.as_view(), name='metadata'),
    path('', include(router.urls)),
]
