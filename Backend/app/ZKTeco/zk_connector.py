from zk import ZK
from datetime import datetime
from label.models import Label, LabelData
from employe.models import Employe

def connect_to_device(ip_address="192.168.1.201", port=4370):
    zk = ZK(ip_address, port=port, timeout=10, password=0, force_udp=False, ommit_ping=False)
    return zk.connect()

def fetch_attendance():
    try:
        conn = connect_to_device()
        logs = conn.get_attendance()
        conn.disconnect()

        for log in logs:
            print(f"User: {log.user_id}, Time: {log.timestamp}, Status: {log.status}")

            # Match attendance to the corresponding employee
            try:
                employe = Employe.objects.get(pk=log.user_id)
                label = Label.objects.get(employe=employe)

                # Determine attendance status
                status = map_zk_status(log.status)

                # Handle pause logic
                if status == "en pause":
                    label_data = LabelData.objects.filter(label=label, status="present").last()
                    if label_data:
                        label_data.endPause = log.timestamp
                        label_data.status = "en pause"
                        label_data.save()

                # Create or update LabelData
                LabelData.objects.create(
                    label=label,
                    startDate=log.timestamp,
                    endDate=None,
                    startPause=None,
                    endPause=None,
                    status=status,
                )

            except Employe.DoesNotExist:
                print(f"Employe with ID {log.user_id} not found.")
            except Label.DoesNotExist:
                print(f"No Label found for employee {log.user_id}.")

    except Exception as e:
        print(f"Error fetching attendance: {e}")

def map_zk_status(status):
    status_mapping = {
        0: "present",      # Check-in
        1: "en pause",     # Break
        2: "fin de service" # Check-out
    }
    return status_mapping.get(status, "anomalie")