from zk.base import ZK, const
from django.http import HttpResponse
from django.http import JsonResponse



def connect_device(request):
    zk = ZK('192.168.1.203', port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
    conn_status = zk.connect()
    if conn_status:
        print("Connected to the device.")
        is_connected="Connected to the device."
    else:
        is_connected="Failed to connect to the device."
        print("Failed to connect to the device.")
    return JsonResponse(is_connected, safe=False, status=200)

def get_attendance_data(request):
    zk = ZK('192.168.1.203', port=4370)
    conn = zk.connect()
    attendance_list = []
    if conn:
        print("Connected to device")
        zk.disable_device()
        if zk.enable_device():
            print("Device is enabled")
            attendance_records = zk.get_attendance()
            print('zk---', attendance_records)
            for record in attendance_records:
                user_id =record.user_id
                # user = User.objects.get(matricule=user_id)
                attendance_dict = {
                    "user": record.user_id,
                    "checkin": record.timestamp,
                    "date": record.timestamp.strftime("%d-%m-%Y"),
                }
                attendance_list.append(attendance_dict)     
            zk.enable_device()
        else:
            print("Unable to enable device")
        zk.disconnect()
    else:
        print("Unable to connect to device")
    return JsonResponse(attendance_list, safe=False)

def add_user_device(request):
    zk = ZK('192.168.1.203', port=4370)
    conn = zk.connect()
    attendance_list = []
    if conn:
        print("Connected to device")
        zk.disable_device()
        if zk.enable_device():
            print("Device is enabled")
            user_info = {"id": "001", "name": "Aness Bouaoud", "password": "1234", "group_id": "1"}
            result = zk.set_user_info(**user_info)
            if result:
                print("User added successfully. User ID:", result)
            else:
                print("Failed to add user.")
            zk.enable_device()
        else:
            print("Unable to enable device")
        zk.disconnect()
    else:
        print("Unable to connect to device")
    return JsonResponse(result, safe=False)

