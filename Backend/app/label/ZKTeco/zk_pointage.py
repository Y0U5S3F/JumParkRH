import csv
import requests
import os
from datetime import datetime

# Constants
DEVICE_API_URL = "http://127.0.0.1:8000/api/appareil/appareils/"

def read_last_uid(filename):
    """Read the last processed UID from the marker file."""
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            first_line = f.readline().strip()
            return int(first_line) if first_line.isdigit() else 0
    return 0

def update_last_uid(filename, uid):
    """Update the marker file with the new last processed UID while preserving subsequent log entries."""
    lines = []
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            lines = f.readlines()
    # Ensure the first line is the marker
    if lines:
        lines[0] = f"{uid}\n"
    else:
        lines = [f"{uid}\n"]
    with open(filename, 'w') as f:
        f.writelines(lines)

def append_log_entry(user_id, returned_id, filename):
    """Append a new check‑in record (user_id, returned_data_id) to the logfile."""
    with open(filename, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([user_id, returned_id])

def get_first_open_data_id_for_user(user_id, filename):
    """
    Retrieve the data_id associated with the first open record for the given user_id 
    from the logfile. Assumes the first line is a marker and subsequent lines are
    formatted as: user_id, returned_data_id.
    """
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip marker line
            for row in reader:
                if row and row[0] == str(user_id):
                    return row[1]
    return None

def remove_first_log_entry(user_id, filename):
    """
    Remove the first log entry for the given user_id from the logfile.
    This way, if a user has multiple open check‑ins, only the oldest one is removed.
    """
    if not os.path.exists(filename):
        return
    with open(filename, 'r', newline='') as f:
        rows = list(csv.reader(f))
    if not rows:
        return
    new_rows = [rows[0]]  # preserve the marker line
    removed = False
    for row in rows[1:]:
        if not removed and row and row[0] == str(user_id):
            removed = True
            continue
        new_rows.append(row)
    with open(filename, 'w', newline='') as f:
        csv.writer(f).writerows(new_rows)

def process_punch(punch):
    """Return a string representation for the punch value."""
    mapping = {0: "Check-In", 1: "Check-Out", 4: "Break Start", 5: "Break End"}
    return mapping.get(punch, "Unknown")

def send_label_data(user_id, start_date, end_date, start_pause, end_pause, status, token):
    """
    For a check‑in (punch 0), send the initial POST request.
    The fields end_date, start_pause, and end_pause can be None.
    """
    url = f"http://127.0.0.1:8000/api/label/labels/auto/{user_id}/"
    payload = {
       "startDate": start_date,
       "endDate": end_date,
       "startPause": start_pause,
       "endPause": end_pause,
       "status": status
    }
    headers = {'Authorization': token}
    return requests.post(url, json=payload, headers=headers)

def update_record(data_id, field, value, token):
    """Update a single field of the record with the given data_id via a PUT request."""
    url = f"http://127.0.0.1:8000/api/label/labels/data/{data_id}/"
    payload = {field: value}
    headers = {'Authorization': token}
    return requests.put(url, json=payload, headers=headers)

def process_log(log, marker_file, token):
    """
    Process a single log entry based on its punch value.
    Each entry is handled immediately.
    """
    uid, user_id, punch, timestamp, _ = log
    token = token  # Already provided from request header
    start_date_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
    
    if punch == 0:
        # Check-In: verify if an open check‑in already exists.
        existing_data_id = get_first_open_data_id_for_user(user_id, marker_file)
        status = "anomalie" if existing_data_id else "present"
        # When an open record exists, you might want to set endDate to the end of day.
        response = send_label_data(user_id, start_date_str, None, None, None, status, token)
        if response.status_code == 201:
            returned_id = response.json().get("id")
            if existing_data_id:
                remove_first_log_entry(user_id, marker_file)
            append_log_entry(user_id, returned_id, marker_file)

    elif punch == 4:
        # Break Start: update the 'endPause' field then set status to 'present'
        pause_end_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, marker_file)
        if data_id:
            resp = update_record(data_id, "endPause", pause_end_str, token)
            if resp.status_code == 200:
                update_record(data_id, "status", "present", token)

    elif punch == 5:
        # Break End: update the 'startPause' field then set status to 'en pause'
        pause_start_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, marker_file)
        if data_id:
            resp = update_record(data_id, "startPause", pause_start_str, token)
            if resp.status_code == 200:
                update_record(data_id, "status", "en pause", token)

    elif punch == 1:
        # Check‑Out: update the 'endDate' field then set status to 'fin de service'
        end_date_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, marker_file)
        if data_id:
            resp = update_record(data_id, "endDate", end_date_str, token)
            if resp.status_code == 200:
                update_record(data_id, "status", "fin de service", token)

def fetch_devices(request):
    """Fetch device details from the backend API and return only connected devices."""
    token = request.headers.get('Authorization')
    headers = {'Authorization': token}
    response = requests.get(DEVICE_API_URL, headers=headers)
    
    if response.status_code == 200:
        devices = response.json()
        # Filter devices with status "connecte"
        connected_devices = [device for device in devices if device.get("status") == "Connecte"]
        return connected_devices
    else:
        print(f"Error fetching devices: {response.text}")
        return []
