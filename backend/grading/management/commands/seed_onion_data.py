from django.core.management.base import BaseCommand
from grading.models import OnionVariety, DefectReferenceSample

VARIETIES_DATA = [
    {
        'code': 'nashik_red',
        'name': 'Nashik Red',
        'variety_type': 'Rabi / Storage',
        'origin': 'Nashik, Maharashtra',
        'image_url': '/media/varieties/nashik-red.jpg',
        'characteristics': 'High TSS, firm tight scales, deep purplish-red skin with excellent storage life.',
        'order': 1,
    },
    {
        'code': 'bhima_super',
        'name': 'Bhima Super',
        'variety_type': 'Kharif / High Yield',
        'origin': 'ICAR-DOGR, Rajgurunagar',
        'image_url': '/media/varieties/Bhima-Super-Red-Onion.jpg',
        'characteristics': 'Vibrant red round bulbs, high yield, moderate pungency.',
        'order': 2,
    },
    {
        'code': 'bellary_red',
        'name': 'Bellary Red',
        'variety_type': 'Southern High Color',
        'origin': 'Bellary, Karnataka',
        'image_url': '/media/varieties/bellary red.jpg',
        'characteristics': 'Bright coppery red, slightly flattened round bulb, robust export caliber.',
        'order': 3,
    },
    {
        'code': 'pune_fursungi',
        'name': 'Pune Fursungi',
        'variety_type': 'Export / Rabi',
        'origin': 'Pune / Ahmednagar, MH',
        'image_url': '/media/varieties/puna-fursungi-onion.jpg',
        'characteristics': 'Light copper red, thin neck, tight adherent skin with minimal sprouting.',
        'order': 4,
    },
    {
        'code': 'bangalore_rose',
        'name': 'Bangalore Rose',
        'variety_type': 'GI Tag / Export Pickle',
        'origin': 'Chikkaballapur / Bengaluru, Karnataka',
        'image_url': '/media/varieties/bangalore-rose-onion.jpg',
        'characteristics': 'GI Tagged. Spherical flat-topped button bulbs, deep scarlet color, rich in anthocyanin.',
        'order': 5,
    },
    {
        'code': 'agrifound_dark_red',
        'name': 'Agrifound Dark Red',
        'variety_type': 'Dark Red / Storage',
        'origin': 'NHRDF, Nashik',
        'image_url': '/media/varieties/agrifound-red-organic-red-onion.jpeg',
        'characteristics': 'Dark purplish-red globular bulbs, 5–6 cm diameter, firm fleshy scales.',
        'order': 6,
    },
    {
        'code': 'pusa_red',
        'name': 'Pusa Red',
        'variety_type': 'Medium Red / High TSS',
        'origin': 'IARI, New Delhi',
        'image_url': '/media/varieties/pusa-red-onion.jpg',
        'characteristics': 'Bronze red, flat-globular, 13–14% TSS, less prone to bolting.',
        'order': 7,
    },
    {
        'code': 'white_onion',
        'name': 'White Onion (Dehydration)',
        'variety_type': 'Processing / High Solids',
        'origin': 'Bhavnagar / Mahuva, Gujarat',
        'image_url': '/media/varieties/white-onion.webp',
        'characteristics': 'Chalky white, high dry matter (18–20% TSS), tailored for dehydration flakes and powder.',
        'order': 8,
    },
    {
        'code': 'yellow_granex',
        'name': 'Yellow Granex',
        'variety_type': 'Sweet / Mild',
        'origin': 'Subtropical / Winter Crop',
        'image_url': '/media/varieties/Yellow Granex.jpg',
        'characteristics': 'Semi-flat golden-yellow scales, sweet juicy flesh, mild pungency.',
        'order': 9,
    },
    {
        'code': 'red_creole',
        'name': 'Red Creole',
        'variety_type': 'Pungent / Storage',
        'origin': 'Warm Semi-Arid Tropics',
        'image_url': '/media/varieties/redcreoleonion.jpg',
        'characteristics': 'Deep bronze-red skin, flat thick bulbs, heavy pungency, long shelf life.',
        'order': 10,
    },
    {
        'code': 'pusa_white_round',
        'name': 'Pusa White Round',
        'variety_type': 'White / High Yield',
        'origin': 'IARI, New Delhi',
        'image_url': '/media/varieties/Pusa White Round.jpg',
        'characteristics': 'Uniform globe shape, pure white wrapper scales, excellent dehydration yield.',
        'order': 11,
    },
    {
        'code': 'pusa_madhavi',
        'name': 'Pusa Madhavi',
        'variety_type': 'Light Red / Medium Storage',
        'origin': 'IARI, New Delhi',
        'image_url': '/media/varieties/Pusa Madhavi.jpg',
        'characteristics': 'Light reddish-bronze outer skin, mild to medium storage potential.',
        'order': 12,
    },
    {
        'code': 'arka_kalyan',
        'name': 'Arka Kalyan',
        'variety_type': 'Pinkish Red / Kharif',
        'origin': 'ICAR-IIHR, Bengaluru',
        'image_url': '/media/varieties/Arka Kalyan.jpg',
        'characteristics': 'Pinkish-red globes, resistance to purple blotch disease, thick cured wrapper.',
        'order': 13,
    },
    {
        'code': 'agrifound_light_red',
        'name': 'Agrifound Light Red',
        'variety_type': 'Light Red / Rabi',
        'origin': 'NHRDF, Nashik',
        'image_url': '/media/varieties/aflightred.jpg',
        'characteristics': 'Light copper-red, tight bulb center, high export suitability to Southeast Asia.',
        'order': 14,
    },
    {
        'code': 'other',
        'name': 'Other',
        'variety_type': 'Unspecified',
        'origin': 'Local APMC Mandi',
        'image_url': '/media/varieties/nashik-red.jpg',
        'characteristics': 'Standard mixed commercial lot with variable grading parameters.',
        'order': 15,
    },
]

DEFECT_SAMPLES_DATA = [
    {
        'sample_id': 'sample_sprout',
        'title': 'Sprouted Bulb Evidence',
        'tag': '[DEFECT: SPROUT (MODERATE)]',
        'class_tag': 'TAG: CLASS II',
        'tag_bg': 'bg-rose-950/85 text-rose-200 border-rose-700',
        'badge_bg': 'bg-amber-900/85 text-amber-200 border-amber-700',
        'image_url': '/media/samples/sprouted_sample.jpg',
        'description': 'Fresh shoot emerging from neck. Moisture exposure during storage.',
        'order': 1,
    },
    {
        'sample_id': 'sample_grade_a',
        'title': 'Pristine Export Grade A',
        'tag': '[OK: EXPORT COMPLIANT]',
        'class_tag': 'TAG: GRADE A',
        'tag_bg': 'bg-emerald-950/85 text-emerald-200 border-emerald-700',
        'badge_bg': 'bg-teal-900/85 text-teal-200 border-teal-700',
        'image_url': '/media/samples/pristine_sample.jpg',
        'description': 'Dry intact wrapper scales, cured tight neck, firm solid flesh.',
        'order': 2,
    },
    {
        'sample_id': 'sample_doubles',
        'title': 'Twin / Split Bulb Defect',
        'tag': '[DEFECT: DOUBLES (LIGHT)]',
        'class_tag': 'TAG: BORDERLINE',
        'tag_bg': 'bg-amber-950/85 text-amber-200 border-amber-700',
        'badge_bg': 'bg-stone-900/85 text-stone-200 border-stone-600',
        'image_url': '/media/samples/twin_sample.jpg',
        'description': 'Secondary growing point splitting bulb into conjoined twin bulbs.',
        'order': 3,
    },
]


class Command(BaseCommand):
    help = 'Seeds initial onion varieties and defect reference samples into the database'

    def handle(self, *args, **options):
        # 1. Seed Varieties
        for item in VARIETIES_DATA:
            obj, created = OnionVariety.objects.update_or_create(
                code=item['code'],
                defaults=item
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"{action} variety: {obj.name}")

        # 2. Seed Defect Reference Samples
        for item in DEFECT_SAMPLES_DATA:
            obj, created = DefectReferenceSample.objects.update_or_create(
                sample_id=item['sample_id'],
                defaults=item
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"{action} defect sample: {obj.title}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded backend reference data!'))
