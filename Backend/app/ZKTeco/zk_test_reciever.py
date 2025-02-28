from zk import ZK
import csv

# Device details
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370

# File to save attendance logs
OUTPUT_FILE = 'attendance_logs.csv'

# Initialize ZK object
zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)

conn = None
try:
    # Connect to the device
    conn = zk.connect()
    print(f"Successfully connected to {DEVICE_IP}:{DEVICE_PORT}")

    # Get device information (optional)
    device_info = conn.get_device_name()
    print(f"Device Name: {device_info}")

    # Fetch all users and build a mapping: user_id -> user object
    users = conn.get_users()
    user_dict = {user.user_id: user for user in users}

    # Fetch attendance logs
    print("Fetching attendance logs...")
    attendance_logs = conn.get_attendance()

    # Save selected attendance details to a CSV file
    if attendance_logs:
        with open(OUTPUT_FILE, mode='w', newline='') as file:
            writer = csv.writer(file)
            # Write header
            writer.writerow(["UID", "Punch", "Status", "Timestamp", "Name"])

            # Write attendance logs
            for log in attendance_logs:
                user = user_dict.get(log.user_id)
                name = user.name if user else "Unknown"
                writer.writerow([log.user_id, log.punch, log.status, log.timestamp, name])

        print(f"Attendance logs saved to {OUTPUT_FILE}")
    else:
        print("No attendance logs found.")

except Exception as e:
    print(f"Failed to connect or fetch data. Error: {e}")
finally:
    if conn:
        conn.disconnect()
        print("Disconnected from the device.")
