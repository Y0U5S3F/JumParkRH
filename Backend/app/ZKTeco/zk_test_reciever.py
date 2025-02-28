from zk import ZK
import csv
import os
import requests

# Device details
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370
OUTPUT_FILE = 'attendance_logs.csv'

# Initialize ZK object
zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)

# Function to get the last UID and last punch state per user
def get_last_records(filename):
    last_uid = 0
    user_last_punch = {}  # Stores last punch state per user_id
    
    if not os.path.exists(filename):
        return last_uid, user_last_punch  # Return empty data if no file

    with open(filename, mode='r') as file:
        reader = list(csv.reader(file))
        if len(reader) > 1:  # Ensure there is data besides the header
            for row in reader[1:]:  # Skip header
                uid = int(row[0])  # Column 1 = UID
                user_id = int(row[1])  # Column 2 = User ID
                punch = int(row[2])  # Column 3 = Punch (0 or 1)

                last_uid = max(last_uid, uid)  # Track highest UID
                user_last_punch[user_id] = punch  # Update last punch per user
                
    return last_uid, user_last_punch

conn = None
try:
    # Connect to the device
    conn = zk.connect()
    print(f"Successfully connected to {DEVICE_IP}:{DEVICE_PORT}")

    # Fetch all users and build a mapping: user_id -> user object
    users = conn.get_users()
    user_dict = {user.user_id: user for user in users}

    # Fetch attendance logs
    print("Fetching attendance logs...")
    attendance_logs = conn.get_attendance()

    # Get last stored UID and last punch per user
    last_uid, user_last_punch = get_last_records(OUTPUT_FILE)
    print(f"Last recorded UID: {last_uid}")
    
    # Filter only new logs (UID > last recorded one)
    new_logs = [log for log in attendance_logs if log.uid > last_uid]

    # Lists to categorize logs
    append_list = []
    new_list = []

    # Process new logs
    for log in new_logs:
        user_id = log.user_id
        punch = log.punch  # Current punch type
        
        # Check the last recorded punch state for this user
        last_punch = user_last_punch.get(user_id, None)  # Default None if no previous entry
        
        log_entry = [log.uid, log.user_id, log.punch, log.timestamp]  # Matches your columns

        if last_punch == 0 and punch == 1:
            append_list.append(log_entry)  # Check-Out → Check-In
        else:
            new_list.append(log_entry)  # Other cases
        
        user_last_punch[user_id] = punch

    # Print categorized logs
    print("\nLogs to Append (Check-Out → Check-In):")
    print(append_list)

    print("\nNew Logs (All others):")
    print(new_list)

    # Append to CSV file if new data exists
    if new_logs:
        file_exists = os.path.exists(OUTPUT_FILE)
        with open(OUTPUT_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)

            # If file is new, write the header
            if not file_exists or os.stat(OUTPUT_FILE).st_size == 0:
                writer.writerow(["UID", "User ID", "Punch", "Timestamp"])

            # Write both lists (append_list and new_list)
            writer.writerows(append_list)
            writer.writerows(new_list)

        print(f"Added {len(new_logs)} new entries to {OUTPUT_FILE}")

except Exception as e:
    print(f"Failed to connect or fetch data. Error: {e}")
finally:
    if conn:
        conn.disconnect()
        print("Disconnected from the device.")

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000/api/label/labels"

# Function to create a new labeldata record for a given user (UID)
def create_label_data(uid, data):
    create_url = f"{BASE_URL}/create/{uid}/"
    response = requests.post(create_url, json=data)
    if response.ok:
        record = response.json()
        record_id = record.get('id')
        print(f"Record created with ID: {record_id}")
        return record_id
    else:
        print("Failed to create record:", response.text)
        return None

# Function to update an existing labeldata record using its record ID
def update_label_data(record_id, data):
    update_url = f"{BASE_URL}/{record_id}/"
    response = requests.put(update_url, json=data)
    if response.ok:
        print("Record updated successfully!")
    else:
        print("Failed to update record:", response.text)

# Sample data for creation and update:
create_payload = {
    "start_date": "2025-02-19T09:00:00",
    "end_date": "2025-02-19T17:00:00",
    "start_pause": None,  # You can leave pauses empty initially
    "end_pause": None,
    "status": "present",
    "label": 6
}

update_payload = {
    "start_date": "2025-02-19T09:00:00",
    "end_date": "2025-02-19T17:00:00",
    "start_pause": "2025-02-20T12:00:00",
    "end_pause": "2025-02-20T13:00:00",
    "status": "present",
    "label": 6
}

# Example usage:
uid = 65  # This is your user id

# Create a new record
record_id = create_label_data(uid, create_payload)

# Later, when you need to update the record (e.g., on check-out or pause event)
if record_id:
    update_label_data(record_id, update_payload)

