import random
from datetime import datetime, timedelta

class MockZKDevice:
    def __init__(self):
        self.attendance_logs = []

    def connect(self):
        print("[Mock] Connected to mock ZKTeco device.")
        return self

    def disconnect(self):
        print("[Mock] Disconnected from mock ZKTeco device.")

    def generate_mock_logs(self, user_ids, num_logs=10):
        status_options = [0, 1, 2, 3]  # 0: Check-In, 1: Break Start, 2: Break End, 3: Check-Out

        for _ in range(num_logs):
            user_id = random.choice(user_ids)
            status = random.choice(status_options)

            # Generate a timestamp within the last 7 days
            timestamp = datetime.now() - timedelta(days=random.randint(0, 7), hours=random.randint(0, 23), minutes=random.randint(0, 59))

            log = MockLog(user_id, timestamp, status)
            self.attendance_logs.append(log)

    def get_attendance(self):
        return self.attendance_logs

class MockLog:
    def __init__(self, user_id, timestamp, status):
        self.user_id = user_id
        self.timestamp = timestamp
        self.status = status

    def __repr__(self):
        return f"MockLog(user_id={self.user_id}, timestamp={self.timestamp}, status={self.status})"

if __name__ == "__main__":
    from django.conf import settings
    import django

    settings.configure()
    django.setup()

    from label.models import Label

    # Fetch ZKTeco IDs from Label model
    user_ids = list(Label.objects.values_list("zkteco_id", flat=True))

    mock_device = MockZKDevice()
    mock_device.connect()
    mock_device.generate_mock_logs(user_ids, num_logs=20)

    logs = mock_device.get_attendance()

    for log in logs:
        print(log)

    mock_device.disconnect()
