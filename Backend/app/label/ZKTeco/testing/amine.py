from zk import ZK
import csv
import os
import requests
import datetime

# Device details
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370

# esm 

# Initialize ZK object
zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)

def get_filtered_logs(logs, start_date):
    """Filters logs from the given start date."""
    return [log for log in logs if log.timestamp.date() >= start_date]

PUNCH_TO_STATE = {
    0: "Check-In",
    1: "Check-Out",
    4: "Pause-Out",
    5: "Pause-In"
}

def main():
    conn = None
    try:
        start_date_str = input("Enter the start date (DD/MM/YYYY): ")
        start_date = datetime.datetime.strptime(start_date_str, "%d/%m/%Y").date()

        conn = zk.connect()
        print(f"Successfully connected to {DEVICE_IP}:{DEVICE_PORT}")

        users = conn.get_users()
        user_dict = {int(user.user_id): user for user in users if user.user_id}

        print("Fetching attendance logs...")
        attendance_logs = conn.get_attendance()
        filtered_logs = get_filtered_logs(attendance_logs, start_date)
        
        log_entries = []
        
        for log in filtered_logs:
            user_id = int(log.user_id)
            punch = log.punch
            
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
            log_entries.append([log.uid, log.user_id, user_name, log.punch, state, log.timestamp])
        
        if filtered_logs:
            current_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"logs_{current_time}.csv"
            
            with open(output_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(["UID", "User ID", "Name", "Punch", "State", "Timestamp"])
                writer.writerows(log_entries)
            
            print(f"Added {len(filtered_logs)} new entries to {output_file}")

    except Exception as e:
        print(f"Failed to connect or fetch data. Error: {e}")
    
    finally:
        if conn:
            conn.disconnect()
            print("Disconnected from the device.")

if __name__ == "__main__":
    main()
