import csv
import os
import requests
from zk import ZK

# Constants
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370
MARKER_FILE = 'logs.csv'

def read_last_uid(filename):
    """Read the last processed UID from the marker file."""
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            first_line = f.readline().strip()
            try:
                return int(first_line)
            except ValueError:
                print("Invalid UID in marker file. Defaulting to 0.")
                return 0
    return 0

def update_last_uid(filename, uid):
    """Update the marker file with the new last processed UID while preserving log entries."""
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            lines = f.readlines()
        if lines:
            lines[0] = str(uid) + "\n"
        else:
            lines = [str(uid) + "\n"]
        with open(filename, 'w') as f:
            f.writelines(lines)
        print(f"Updated last processed UID to {uid} in {filename}")
    else:
        with open(filename, 'w') as f:
            f.write(str(uid) + "\n")
        print(f"Created {filename} and set last processed UID to {uid}")

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
            rows = list(reader)
        # Skip the marker (first line) and return the first matching record.
        for row in rows[1:]:
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
        reader = csv.reader(f)
        rows = list(reader)
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
        writer = csv.writer(f)
        writer.writerows(new_rows)

def process_punch(punch):
    """Return a string representation for the punch value."""
    match punch:
        case 0: return "Check-In"
        case 1: return "Check-Out"
        case 4: return "Break Start"
        case 5: return "Break End"
        case _: return "Unknown"

def send_label_data(user_id, start_date, end_date, start_pause, end_pause, status):
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
    return requests.post(url, json=payload)

def update_record(data_id, field, value):
    """
    Update a single field of the record with the given data_id via a PUT request.
    """
    url = f"http://127.0.0.1:8000/api/label/labels/data/{data_id}/"
    payload = { field: value }
    return requests.put(url, json=payload)

def process_log(log):
    """
    Process a single log entry based on its punch value.
    Each entry is handled immediately.
    """
    uid, user_id, punch, timestamp, event = log

    if punch == 0:
        # Check if the user already has an open check‑in.
        existing_data_id = get_first_open_data_id_for_user(user_id, MARKER_FILE)
        start_date_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        status = "present" if not existing_data_id else "anomalie"
        response = send_label_data(user_id, start_date_str, None, None, None, status)
        
        if response.status_code == 201:
            returned_id = response.json().get("id")
            if existing_data_id:
                # Replace the old log ID with the new one
                remove_first_log_entry(user_id, MARKER_FILE)
                print(f"User {user_id} already had an open check‑in (record ID: {existing_data_id}). Replacing with new record ID: {returned_id}.")
            append_log_entry(user_id, returned_id, MARKER_FILE)
            print(f"Check‑In processed for user {user_id} with status '{status}'.")
        else:
            print(f"Error processing Check‑In for user {user_id}: {response.text}")

    elif punch == 4:
        # Break Start: update the 'endPause' field and 'status' to 'present' for the open record.
        pause_end_date = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, MARKER_FILE)
        if data_id:
            response = update_record(data_id, "endPause", pause_end_date)
            if response.status_code == 200:
                # Update the status to "present"
                response = update_record(data_id, "status", "present")
                if response.status_code == 200:
                    print(f"Break Start processed for user {user_id}: updated endPause and status to 'present'.")
                else:
                    print(f"Error updating status for user {user_id}: {response.text}")
            else:
                print(f"Error updating endPause for user {user_id}: {response.text}")
        else:
            print(f"No open log entry found for user {user_id} for Break Start event.")

    elif punch == 5:
        # Break End: update the 'startPause' field and 'status' to 'en pause' for the open record.
        pause_start_date = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, MARKER_FILE)
        if data_id:
            response = update_record(data_id, "startPause", pause_start_date)
            if response.status_code == 200:
                # Update the status to "en pause"
                response = update_record(data_id, "status", "en pause")
                if response.status_code == 200:
                    print(f"Break End processed for user {user_id}: updated startPause and status to 'en pause'.")
                else:
                    print(f"Error updating status for user {user_id}: {response.text}")
            else:
                print(f"Error updating startPause for user {user_id}: {response.text}")
        else:
            print(f"No open log entry found for user {user_id} for Break End event.")

    elif punch == 1:
        # Check‑Out: update the 'endDate' and 'status' fields on the first open record and remove that entry.
        end_date = timestamp.strftime("%Y-%m-%dT%H:%M:%S")
        data_id = get_first_open_data_id_for_user(user_id, MARKER_FILE)
        if data_id:
            response = update_record(data_id, "endDate", end_date)
            if response.status_code == 200:
                # Update the status to "fin de service"
                response = update_record(data_id, "status", "fin de service")
                if response.status_code == 200:
                    print(f"Check‑Out processed for user {user_id}: updated endDate and status to 'fin de service'.")
                    # Remove only the first matching open record.
                    remove_first_log_entry(user_id, MARKER_FILE)
                else:
                    print(f"Error updating status for user {user_id}: {response.text}")
            else:
                print(f"Error updating endDate for user {user_id}: {response.text}")
        else:
            print(f"No open log entry found for user {user_id} for Check‑Out event.")

def main():
    zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)
    conn = None
    try:
        conn = zk.connect()
        print(f"Connected to {DEVICE_IP}:{DEVICE_PORT}")
        attendance_logs = conn.get_attendance()
        last_uid = read_last_uid(MARKER_FILE)
        print(f"Last processed UID: {last_uid}")

        # Process each new log entry as it comes in.
        for log in attendance_logs:
            if log.uid > last_uid:
                event = process_punch(log.punch)
                log_entry = (log.uid, log.user_id, log.punch, log.timestamp, event)
                process_log(log_entry)
                # Update the marker file immediately after processing each log.
                update_last_uid(MARKER_FILE, log.uid)
        print("All logs processed.")
    except Exception as e:
        print("Error:", e)
    finally:
        if conn:
            conn.disconnect()
            print("Disconnected from the device.")

if __name__ == "__main__":
    main()
