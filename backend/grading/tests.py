import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Assessment, calculate_quality_metrics


class QualityCalculationTests(APITestCase):
    def test_grade_a_perfect_metrics(self):
        # 12% moisture (<=14), 0% sprout, 1.5% damage, 0.5% doubles
        score, status_text = calculate_quality_metrics(
            moisture=12.0, sprouting=0.0, damage=1.5, doubles=0.5
        )
        # 100 - 0 - 0 - (1.5*1.5=2.25) - (0.5*1=0.5) = 97.25 -> 97
        self.assertEqual(score, 97)
        self.assertEqual(status_text, 'CERTIFIED')

    def test_high_defect_metrics(self):
        # High moisture 18% -> (18-14)*4 = 16 pts penalty
        # sprouting 10% -> 25 pts
        # damage 12% -> 18 pts
        # doubles 6% -> 6 pts
        # Raw = 100 - (16 + 25 + 18 + 6) = 35
        score, status_text = calculate_quality_metrics(
            moisture=18.0, sprouting=10.0, damage=12.0, doubles=6.0
        )
        self.assertEqual(score, 35)
        self.assertEqual(status_text, 'REJECTED')


class AssessmentAPITests(APITestCase):
    def setUp(self):
        self.valid_payload = {
            'supplierName': 'Sahyadri Agro Producers',
            'supplierPhone': '+91 98220 12345',
            'state': 'Maharashtra',
            'variety': 'nashik_red',
            'grade': 'Grade A',
            'sizeClass': 'Medium',
            'moisture': 12.8,
            'sprouting': 0.0,
            'damage': 1.5,
            'doubles': 0.5,
            'inspectorName': 'Dr. V. M. Deshmukh',
            'notes': 'Cured skin in pristine condition.',
        }

    def _generate_test_image(self):
        file = io.BytesIO()
        image = Image.new('RGB', (100, 100), color='red')
        image.save(file, 'jpeg')
        file.seek(0)
        return SimpleUploadedFile(
            'test_onion.jpg', file.read(), content_type='image/jpeg'
        )

    def test_health_check(self):
        url = reverse('health-check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'healthy')

    def test_create_assessment_json(self):
        url = reverse('assessment-list')
        response = self.client.post(url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['lot_id'].startswith('IN-ONION-'))
        self.assertEqual(response.data['supplier_name'], 'Sahyadri Agro Producers')
        self.assertGreaterEqual(response.data['computed_score'], 90)
        self.assertEqual(response.data['quality_status'], 'CERTIFIED')

    def test_create_assessment_with_image_multipart(self):
        url = reverse('assessment-list')
        test_img = self._generate_test_image()
        
        data = {
            'supplier_name': 'Kalyan Mandi Batch',
            'supplier_phone': '+91 94231 99880',
            'state': 'Karnataka',
            'variety': 'bellary_red',
            'grade': 'Grade B',
            'size_class': 'Large',
            'moisture': 13.0,
            'sprouting': 1.0,
            'damage': 2.0,
            'doubles': 1.0,
            'uploaded_images': [test_img],
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['images']), 1)
        self.assertIn('url', response.data['images'][0])

    def test_download_pdf_certificate(self):
        # First create an assessment
        assessment = Assessment.objects.create(
            lot_id='IN-ONION-TEST99',
            supplier_name='Nashik Onion Farmers Co.',
            supplier_phone='+91 98221 00000',
            state='Maharashtra',
            variety='nashik_red',
            grade='Grade A',
            size_class='Medium',
            moisture=12.5,
            sprouting=0.0,
            damage=1.0,
            doubles=0.0,
            inspector_name='Inspector Ramesh',
        )

        url = reverse('assessment-pdf', kwargs={'pk': assessment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('attachment;', response['Content-Disposition'])
        self.assertIn('IN-ONION-TEST99', response['Content-Disposition'])
        self.assertGreater(len(response.content), 1000)

    def test_stats_endpoint(self):
        # Create sample assessments
        Assessment.objects.create(
            supplier_name='Farmer A',
            supplier_phone='9999999999',
            variety='nashik_red',
            grade='Grade A',
            moisture=12.0,
        )
        Assessment.objects.create(
            supplier_name='Farmer B',
            supplier_phone='8888888888',
            variety='bhima_super',
            grade='Grade B',
            moisture=16.0,
            sprouting=5.0,
        )

        url = reverse('assessment-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['totalAssessments'], 2)
        self.assertIn('Grade A', response.data['gradeBreakdown'])
        self.assertIn('Grade B', response.data['gradeBreakdown'])
