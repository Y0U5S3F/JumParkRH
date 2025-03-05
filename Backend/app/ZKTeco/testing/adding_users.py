import requests
from zk import ZK

# Constants
DEVICE_API_URL = 'http://127.0.0.1:8000/api/appareil/appareils/'

def fetch_devices(api_url):
    response = requests.get(api_url)
    response.raise_for_status()
    return response.json()

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

def remove_user(device_ip, device_port, user_id):
    zk = ZK(device_ip, port=device_port, timeout=5)
    conn = None

    try:
        conn = zk.connect()
        print(f"Connected to {device_ip}:{device_port}")
        conn.delete_user(uid=user_id)
        print(f"User with user ID {user_id} removed.")
    except Exception as e:
        print("Error:", e)
    finally:
        if conn:
            conn.disconnect()
            print("Disconnected from the device.")

if __name__ == "__main__":
    devices = fetch_devices(DEVICE_API_URL)
    for device in devices:
        add_user(device['ip'], device['port'], user_id=35001, name='John Doe')
        # To remove a user, uncomment the following line:
        # remove_user(device['ip'], device['port'], user_id=35001)