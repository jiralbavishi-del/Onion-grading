from rest_framework import serializers
from .models import (
    Assessment,
    AssessmentImage,
    OnionVariety,
    DefectReferenceSample,
    calculate_quality_metrics,
)


class OnionVarietySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='code', read_only=True)
    type = serializers.CharField(source='variety_type', read_only=True)
    img = serializers.SerializerMethodField()

    class Meta:
        model = OnionVariety
        fields = ['id', 'code', 'name', 'type', 'origin', 'characteristics', 'img', 'order']

    def get_img(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        if obj.image_url:
            if obj.image_url.startswith('http') or not request:
                return obj.image_url
            return request.build_absolute_uri(obj.image_url)
        return ''


class DefectReferenceSampleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='sample_id', read_only=True)
    classTag = serializers.CharField(source='class_tag', read_only=True)
    tagBg = serializers.CharField(source='tag_bg', read_only=True)
    badgeBg = serializers.CharField(source='badge_bg', read_only=True)
    img = serializers.SerializerMethodField()

    class Meta:
        model = DefectReferenceSample
        fields = ['id', 'sample_id', 'title', 'tag', 'classTag', 'tagBg', 'badgeBg', 'img', 'description', 'order']

    def get_img(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        if obj.image_url:
            if obj.image_url.startswith('http') or not request:
                return obj.image_url
            return request.build_absolute_uri(obj.image_url)
        return ''



class AssessmentImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = AssessmentImage
        fields = ['id', 'image', 'filename', 'uploaded_at', 'url']
        read_only_fields = ['id', 'uploaded_at', 'url']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class AssessmentSerializer(serializers.ModelSerializer):
    images = AssessmentImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    # Support optional lot_id (auto-generated if omitted)
    lot_id = serializers.CharField(required=False, allow_blank=True)

    # Support camelCase aliases from frontend JSON
    supplierName = serializers.CharField(write_only=True, required=False)
    supplierPhone = serializers.CharField(write_only=True, required=False)
    sizeClass = serializers.CharField(write_only=True, required=False)
    inspectorName = serializers.CharField(write_only=True, required=False, allow_blank=True)
    computedScore = serializers.IntegerField(write_only=True, required=False)
    lotId = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Assessment
        fields = [
            'id',
            'lot_id',
            'lotId',
            'supplier_name',
            'supplierName',
            'supplier_phone',
            'supplierPhone',
            'state',
            'variety',
            'grade',
            'size_class',
            'sizeClass',
            'moisture',
            'sprouting',
            'damage',
            'doubles',
            'inspector_name',
            'inspectorName',
            'notes',
            'computed_score',
            'computedScore',
            'quality_status',
            'created_at',
            'updated_at',
            'images',
            'uploaded_images',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'quality_status']

    def to_internal_value(self, data):
        # Normalize camelCase into snake_case if present
        mutable_data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        mapping = {
            'supplierName': 'supplier_name',
            'supplierPhone': 'supplier_phone',
            'sizeClass': 'size_class',
            'inspectorName': 'inspector_name',
            'computedScore': 'computed_score',
            'lotId': 'lot_id',
        }
        for camel, snake in mapping.items():
            if camel in mutable_data and snake not in mutable_data:
                mutable_data[snake] = mutable_data[camel]

        return super().to_internal_value(mutable_data)

    def validate_supplier_phone(self, value):
        digits = ''.join(filter(str.isdigit, value or ''))
        if len(digits) < 8:
            raise serializers.ValidationError("Contact phone must contain at least 8 digits.")
        return value

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Remove write_only alias keys if still lingering in validated_data
        for key in ['supplierName', 'supplierPhone', 'sizeClass', 'inspectorName', 'computedScore', 'lotId']:
            validated_data.pop(key, None)

        assessment = Assessment.objects.create(**validated_data)

        for img in uploaded_images:
            AssessmentImage.objects.create(
                assessment=assessment,
                image=img,
                filename=getattr(img, 'name', '')
            )

        return assessment
