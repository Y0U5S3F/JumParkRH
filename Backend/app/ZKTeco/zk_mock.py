# your_app/zk_mock.py
import random
from datetime import datetime, timedelta

class MockZK:

    def __init__(self):
        self.connected = False

    def connect(self):
        self.connected = True
        print("[MockZK] Connected to mock ZKTeco device.")
        return self

    def disconnect(self):
        self.connected = False
        print("[MockZK] Disconnected from mock ZKTeco device.")

    def get_attendance(self, num_logs=10):
        
        print("[MockZK] Fetching mock attendance data...")
        
        now = datetime.now()

        logs = [
            {
                "user_id": random.randint(1, 5),
                "timestamp": now - timedelta(minutes=random.randint(1, 300)),
                "status": random.choice([0, 1, 2])
            }
            for _ in range(num_logs)
        ]

        return logs
