from zk import ZK

# Constants
DEVICE_IP = '41.224.5.17'
DEVICE_PORT = 4370

def add_user(device_ip, device_port, user_id, name, privilege=0, password='', group_id='', user_card=0):
    zk = ZK(device_ip, port=device_port, timeout=5)
    conn = None

    try:
        conn = zk.connect()
        print(f"Connected to {device_ip}:{device_port}")
        conn.set_user(uid=user_id, name=name, privilege=privilege, password=password, group_id=group_id, user_card=user_card)
        print(f"User {name} added with user ID {user_id}.")
    except Exception as e:
        print("Error:", e)
    finally:
        if conn:
            conn.disconnect()
            print("Disconnected from the device.")

if __name__ == "__main__":
    # Example of adding a user
    add_user(DEVICE_IP, DEVICE_PORT, user_id=35001, name='John Doe')