from zk import ZK
import csv
import os
import requests

# Device details
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370
OUTPUT_FILE = 'attendance_logs.csv'

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000/api/label/labels"

# Initialize ZK object
zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)

def create_label_data(user_id, data):
    create_url = f"{BASE_URL}/create/{user_id}/"
    response = requests.post(create_url, json=data)
    
    if response.status_code == 404:
        print(f"User ID {user_id} not found. Skipping record creation.")
        return None

    if response.ok:
        record = response.json()
        record_id = record.get('id')
        print(f"Record created with ID: {record_id}")
        return record_id
    else:
        print("Failed to create record:", response.text)
        return None

def update_label_data(record_id, data):
    update_url = f"{BASE_URL}/{record_id}/"
    response = requests.put(update_url, json=data)
    if response.ok:
        print("Record updated successfully!")
    else:
        print("Failed to update record:", response.text)

def get_last_records(filename):
    last_uid = 0
    user_last_punch = {}
    if not os.path.exists(filename):
        return last_uid, user_last_punch

    with open(filename, mode='r') as file:
        reader = list(csv.reader(file))
        if len(reader) > 1:
            for row in reader[1:]:
                try:
                    uid = int(row[0])
                    user_id = int(row[1])
                    punch = int(row[3])
                    last_uid = max(last_uid, uid)
                    user_last_punch[user_id] = punch
                except (ValueError, IndexError):
                    continue
    return last_uid, user_last_punch

PUNCH_TO_STATE = {
    0: "Check-In",
    1: "Check-Out",
    4: "Pause-Out",
    5: "Pause-In"
}

conn = None
try:
    conn = zk.connect()
    print(f"Successfully connected to {DEVICE_IP}:{DEVICE_PORT}")

    users = conn.get_users()
    user_dict = {int(user.user_id): user for user in users if user.user_id}

    print("Fetching attendance logs...")
    attendance_logs = conn.get_attendance()

    last_uid, user_last_punch = get_last_records(OUTPUT_FILE)
    print(f"Last recorded UID: {last_uid}")
    
    new_logs = [log for log in attendance_logs if log.uid > last_uid]

    append_list = []
    new_list = []

    for log in new_logs:
        user_id = int(log.user_id)
        punch = log.punch
        last_punch = user_last_punch.get(user_id, None)

        user = user_dict.get(user_id)
        if user:
            if hasattr(user, 'name') and isinstance(user.name, (str, bytes)):
                if isinstance(user.name, bytes):
                    decoded_name = user.name.decode('utf-8', errors='ignore')
                else:
                    decoded_name = user.name
                user_name = decoded_name.strip() or str(user.user_id)
            else:
                user_name = str(user.user_id)
        else:
            user_name = 'Unknown'

        state = PUNCH_TO_STATE.get(punch, "Unknown State")
        log_entry = [log.uid, log.user_id, user_name, log.punch, state, log.timestamp]

        if last_punch == 0 and punch == 1:
            append_list.append(log_entry)
        else:
            new_list.append(log_entry)
        
        user_last_punch[user_id] = punch

    print("\nLogs to Append (Check-Out → Check-In):")
    print(append_list)
    print("\nNew Logs (All others):")
    print(new_list)

    if new_logs:
        file_exists = os.path.exists(OUTPUT_FILE)
        with open(OUTPUT_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists or os.stat(OUTPUT_FILE).st_size == 0:
                writer.writerow(["UID", "User ID", "Name", "Punch", "State", "Timestamp"])
            writer.writerows(append_list)
            writer.writerows(new_list)
        print(f"Added {len(new_logs)} new entries to {OUTPUT_FILE}")

except Exception as e:
    print(f"Failed to connect or fetch data. Error: {e}")
finally:
    if conn:
        conn.disconnect()
        print("Disconnected from the device.")