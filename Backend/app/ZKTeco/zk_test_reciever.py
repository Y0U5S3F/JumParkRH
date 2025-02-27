from zk import ZK, const

# Device details
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370

# Initialize ZK object
zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)

try:
    # Connect to the device
    conn = zk.connect()
    print(f"Successfully connected to {DEVICE_IP}:{DEVICE_PORT}")

    # Get device information (optional)
    device_info = conn.get_device_name()
    print(f"Device Name: {device_info}")

    # Fetch attendance logs
    print("Fetching attendance logs...")
    attendance_logs = conn.get_attendance()

    # Display attendance logs
    if attendance_logs:
        print("\nAttendance Logs:")
        for log in attendance_logs:
            print(f"User ID: {log.user_id}, Timestamp: {log.timestamp}, Status: {log.status}")
    else:
        print("No attendance logs found.")

except Exception as e:
    # Handle connection or data retrieval errors
    print(f"Failed to connect or fetch data. Error: {e}")
finally:
    # Disconnect from the device
    if conn:
        conn.disconnect()
        print("Disconnected from the device.")