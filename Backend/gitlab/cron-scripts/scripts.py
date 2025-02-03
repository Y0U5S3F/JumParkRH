from attendance.views import get_attendance_dataa  

def main():
    response = get_attendance_dataa(request=None) 

    print("attendance created---",response)

if __name__ == '__main__':
    main()