from .ZKTeco.zk_pointage import update_last_uid, read_last_uid, fetch_devices, process_punch, process_log
from .ZKTeco.pyzk.zk import ZK
from rest_framework import generics
from rest_framework.response import Response
from django.http import StreamingHttpResponse, HttpResponse, JsonResponse
from rest_framework import status
import json
from .models import Label, LabelData
from .serializers import LabelSerializer, LabelDataSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import csv
from django.utils.timezone import now
from django.db.models import Sum, F, ExpressionWrapper, DurationField, Value
from django.db.models.functions import Coalesce
from appareil.models import Appareil
import datetime
import io

class LabelListCreateView(generics.ListCreateAPIView):
    queryset = Label.objects.all().order_by('id').prefetch_related('data')
    serializer_class = LabelSerializer

    def list(self, request, *args, **kwargs):
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        return super().list(request, *args, **kwargs)
    
    def stream_response(self):
        queryset = self.filter_queryset(self.get_queryset())

        def data_stream():
            for label in queryset.iterator(chunk_size=100):
                label_data = {
                    "id": label.id,
                    "employe": label.employe.matricule,
                    "uid": label.uid,
                    "title": label.title,
                    "subtitle": label.subtitle,
                    "data": []
                }
        
                for data_entry in label.data.all():
                    label_data["data"].append({
                        "id": str(data_entry.id),
                        "startDate": data_entry.startDate.replace(tzinfo=None).isoformat() if data_entry.startDate else None,
                        "endDate": data_entry.endDate.replace(tzinfo=None).isoformat() if data_entry.endDate else None,
                        "startPause": data_entry.startPause.replace(tzinfo=None).isoformat() if data_entry.startPause else None,
                        "endPause": data_entry.endPause.replace(tzinfo=None).isoformat() if data_entry.endPause else None,
                        "status": data_entry.get_status_display(),
                    })

        
                yield f"{json.dumps(label_data)}\n"
   

        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response


    def perform_create(self, serializer):
        serializer.save()

class LabelDataCreateView(generics.CreateAPIView):
    queryset = LabelData.objects.all()
    serializer_class = LabelDataSerializer

    def create(self, request, *args, **kwargs):
        employe_uid = self.kwargs.get('employe_uid')
        if employe_uid is None:
            return Response({"detail": "Employee UID not provided in URL."}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(employe_uid, int):
            try:
                employe_uid = int(employe_uid)
            except (TypeError, ValueError):
                return Response({"detail": "Invalid employee UID."}, status=status.HTTP_400_BAD_REQUEST)
        label = Label.objects.filter(uid=employe_uid).order_by('-id').first()
        if not label:
            return Response({"detail": "Label not found for the given employee UID."}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['label'] = label.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LabelDataRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabelData.objects.all()
    serializer_class = LabelDataSerializer
    lookup_field = "id"

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

class LabelDataCreateManualView(generics.CreateAPIView):
    queryset = LabelData.objects.all()
    serializer_class = LabelDataSerializer

    def create(self, request, *args, **kwargs):
        matricule = self.kwargs.get('matricule')
        
        label = Label.objects.filter(employe=matricule).order_by('-id').first()

        if not label:
            return Response(
                {"detail": "Label not found for the given matricule."},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data.copy()
        data['label'] = label.id
        data['matricule'] = matricule

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auto_import_labels(request):
    try:
        devices = fetch_devices(request)
        if not devices:
            return Response({"detail": "No devices found."}, status=status.HTTP_404_NOT_FOUND)
        
        token = request.headers.get('Authorization')
        for device in devices:
            DEVICE_IP = device['ip']
            DEVICE_PORT = device['port']
            marker_file = f"logs_{DEVICE_IP.replace('.', '_')}_{DEVICE_PORT}.csv"
            zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)
            conn = None
            try:
                conn = zk.connect()
                print(f"Connected to Device {DEVICE_IP}:{DEVICE_PORT}")
                attendance_logs = conn.get_attendance()
                last_uid = read_last_uid(marker_file)

                for log in attendance_logs:
                    if log.uid > last_uid:
                        event = process_punch(log.punch)
                        log_entry = (log.uid, log.user_id, log.punch, log.timestamp, event)
                        process_log(log_entry, marker_file, token)
                        update_last_uid(marker_file, log.uid)
                print("All logs processed.")
            except Exception as e:
                print(e)
                return Response({"detail": f"Error importing labels from {DEVICE_IP}:{DEVICE_PORT}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if conn:
                    conn.disconnect()
                    print("Disconnected from the device.")
        
        return Response({"detail": "Labels imported successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"detail": "An error occurred while importing labels."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
##def auto_import_labels(request):
    try:
        devices = fetch_devices(request)
        if not devices:
            return Response({"detail": "No devices found."}, status=status.HTTP_404_NOT_FOUND)
        
        for device in devices:
            DEVICE_IP = device['ip']
            DEVICE_PORT = device['port']
            marker_file = f"logs_{DEVICE_IP.replace('.', '_')}_{DEVICE_PORT}.csv"
            zk = ZK(DEVICE_IP, port=DEVICE_PORT, timeout=5)
            conn = None
            try:
                conn = zk.connect()
                print(f"Connected to Device")
                attendance_logs = conn.get_attendance()
                last_uid = read_last_uid(marker_file)

                for log in attendance_logs:
                    if log.uid > last_uid:
                        event = process_punch(log.punch)
                        log_entry = (log.uid, log.user_id, log.punch, log.timestamp, event)
                        process_log(log_entry, marker_file, request.headers.get('Authorization'))
                        update_last_uid(marker_file, log.uid)
                print("All logs processed.")
            except Exception as e:
                return Response({"detail": f"An error occurred while importing labels from device {DEVICE_IP}:{DEVICE_PORT}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            finally:
                if conn:
                    conn.disconnect()
                    print("Disconnected from the device.")
        
        return Response({"detail": "Labels imported successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "An error occurred while importing labels."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)##

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def monthly_report(request):
    try:
        report_month = int(request.data.get('report_month', now().month))
        report_year = int(request.data.get('report_year', now().year))

        zero_td = datetime.timedelta(0)

        label_data = (
            LabelData.objects
            .filter(
                startDate__year=report_year,
                startDate__month=report_month,
                status="fin de service"
            )
            .annotate(
                work_duration=ExpressionWrapper(
                    Coalesce(
                        F('endDate') - F('startDate'),
                        Value(zero_td, output_field=DurationField())
                    ),
                    output_field=DurationField()
                ),
                pause_duration=ExpressionWrapper(
                    Coalesce(
                        F('endPause') - F('startPause'),
                        Value(zero_td, output_field=DurationField())
                    ),
                    output_field=DurationField()
                ),
                net_duration=ExpressionWrapper(
                    F('work_duration') - F('pause_duration'),
                    output_field=DurationField()
                )
            )
            .values(
                'label__employe__matricule',
                'label__employe__nom',
                'label__employe__prenom'
            )
            .annotate(
                total_duration=Sum('net_duration')
            )
        )

        filename = f"presence_{report_month}_{report_year}.csv"
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        writer = csv.writer(response)
        writer.writerow(["Matricule", "Nom", "Prénom", "Total Heures Travaillées"])

        if not label_data:
            writer.writerow(["No data", "", "", 0])
            return response

        for entry in label_data:
            total_sec = entry['total_duration'].total_seconds() if entry['total_duration'] else 0
            total_hr = round(total_sec / 3600, 2)
            writer.writerow([
                entry['label__employe__matricule'],
                entry['label__employe__nom'],
                entry['label__employe__prenom'],
                total_hr
            ])

        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

PUNCH_TO_STATE = {
    0: "Check-In",
    1: "Check-Out",
    4: "Pause-Out",
    5: "Pause-In"
}

def get_filtered_logs(logs, start_date):
    return [log for log in logs if log.timestamp.date() >= start_date]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def importoriginal(request):
    start_date_str = request.data.get('start_date')
    if not start_date_str:
        return Response({'error': 'Missing "start_date" parameter in DD/MM/YYYY format.'}, status=400)

    try:
        start_date = datetime.datetime.strptime(start_date_str, "%d/%m/%Y").date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use DD/MM/YYYY.'}, status=400)

    devices = Appareil.objects.all()
    if not devices.exists():
        return Response({'error': 'No devices found in the database.'}, status=404)

    boundary = "----DeviceCSVBoundary"
    parts = []

    for device in devices:
        device_name = device.nom if hasattr(device, 'nom') else f"device_{device.id}"
        ip = getattr(device, 'ip', None)
        port = getattr(device, 'port', 4370)

        if not ip:
            continue

        zk = ZK(ip, port=int(port), timeout=5)
        conn = None

        try:
            conn = zk.connect()
            users = conn.get_users()
            user_dict = {int(user.user_id): user for user in users if user.user_id}

            logs = conn.get_attendance()
            filtered_logs = get_filtered_logs(logs, start_date)

            log_entries = []
            for log in filtered_logs:
                user_id = int(log.user_id)
                punch = log.punch

                user = user_dict.get(user_id)
                if user:
                    if hasattr(user, 'name') and isinstance(user.name, (str, bytes)):
                        decoded_name = user.name.decode('utf-8', errors='ignore') if isinstance(user.name, bytes) else user.name
                        user_name = decoded_name.strip() or str(user.user_id)
                    else:
                        user_name = str(user.user_id)
                else:
                    user_name = 'Unknown'

                state = PUNCH_TO_STATE.get(punch, "Unknown State")
                log_entries.append([log.uid, log.user_id, user_name, log.punch, state, log.timestamp])

            log_entries.sort(key=lambda x: x[2].lower())

            if log_entries:
                csv_io = io.StringIO()
                writer = csv.writer(csv_io)
                writer.writerow(["UID", "User ID", "Name", "Punch", "State", "Timestamp"])
                writer.writerows(log_entries)

                filename = f"{device_name}_{start_date.strftime('%d_%m_%Y')}_logs.csv".replace(" ", "_")

                part = (
                    f"--{boundary}\r\n"
                    f"Content-Type: text/csv\r\n"
                    f"Content-Disposition: attachment; filename=\"{filename}\"\r\n\r\n"
                    f"{csv_io.getvalue()}\r\n"
                )
                parts.append(part)

        except Exception as e:
            print(f"Error processing device {device_name}: {e}")
            continue

        finally:
            if conn:
                conn.disconnect()

    if not parts:
        return Response({'message': 'No logs found for any device.'}, status=200)

    multipart_content = ''.join(parts) + f"--{boundary}--\r\n"

    response = HttpResponse(multipart_content, content_type=f"multipart/mixed; boundary={boundary}")
    response['Content-Disposition'] = 'inline; filename="device_logs.multipart"'
    return response