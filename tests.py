from django.test import TestCase

# Create your tests here.
from beacons.serializers import ShopSerializer

opening_days = {
    
}
class ValidationTest(TestCase):
    def test_validation(self):
        serializer = ShopSerializer()
        days = {'days': [1, 2, 3, 4], 'days': [5, 6, 7]}
        self.assertTrue(serializer.valid_days(days), "Should be true")
