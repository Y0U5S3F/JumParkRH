from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from device.models import Device
from device.serializers import DeviceSerializer
from django.http import HttpResponse
import json
from socket import AF_INET, SOCK_DGRAM, SOCK_STREAM, socket, timeout
import re
from zk.base import ZK, const
from django.views.decorators.csrf import csrf_exempt

class ListDevices(ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
class CreateDevice(CreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    
    
class UpdateDeviceAPIView(UpdateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class DeleteDeviceAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific Bank from the database"""
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class DetailDeviceAPIView(RetrieveAPIView):
    """This endpoint allows for details of a specific Bank from the database"""
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer



def is_openport(ip=None, port=None):  # port is open or not
    a_socket = socket(AF_INET, SOCK_STREAM)
    location = a_socket.connect_ex((ip, port))
    if location == 0:
        return True
    else:
        return False

def ipisok(ip=None):
    regex = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"
    # and the string in search() method
    if (re.search(regex, ip)):
        return True
    else:
        return False

def validateinput(ip=None, port=None):
    ip = str(ip)
 # must be only int
    if (int(port) in range(1, 65535)) and port.isdecimal() and ipisok(ip):
        return True if is_openport(ip, int(port)) else False
    else:
        return False

def startconn(ip=None, port=None):
    conn = None
    zk = ZK(ip, port=int(port), timeout=5, password=0,
            force_udp=False, ommit_ping=True)
    conn = zk.connect()
    if not conn:  # this means we have False
        return False
    else:
        return conn


@csrf_exempt
def connect(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print('dataa--', data)
        ip= data['ip']
        port= data['port']
        # ip = request.POST['ip']
        # port = request.POST['port']
        if validateinput(ip, port):
            if not startconn(ip, port):
                return HttpResponse(json.dumps({"code": 0, "state:": "Connection Refused!"}), content_type='application/json', status=404)
            else:
                return HttpResponse(json.dumps({"code": 1, "state:": "Connected !"}), content_type='application/json')
        else:
            return HttpResponse(json.dumps({"code": 0, "state:": "Bad Input!"}), content_type='application/json', status=400)
    elif request.method == "OPTIONS":
        return HttpResponse(json.dumps({"code": 1, "state:": "POST,OPTIONS"}), content_type='application/json')
    else:
        return HttpResponse(json.dumps({"code": 0, "state:": "Only POST ,OPTIONS requests are allowed"}), content_type='application/json', status=503)
