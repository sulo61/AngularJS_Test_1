from django.test import TestCase

# Create your tests here.
from beacons.serializers import ShopSerializer

test_json = {
    "name": "Hello",
    "opening_hours": [{"days": [1, 2, 3], "open_time": "20:00:00.000000", "close_time": "20:00:00.000000"},
                      {"days": [4, 5, 6, 7], "open_time": "20:00:00.000000", "close_time": "20:00:00.000000"}]
}


class ValidationTest(TestCase):
    def test_validation(self):
        serializer = ShopSerializer()
        self.assertTrue(serializer.valid_days(test_json.pop('opening_hours')), "Should be true")
