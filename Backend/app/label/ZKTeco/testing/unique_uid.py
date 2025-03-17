import csv
import os

# Constants
INPUT_FILE = 'attendance_logs.csv'
OUTPUT_FILE = 'unique_user_ids.csv'

def get_unique_user_ids(input_file):
    unique_users = set()

    if not os.path.exists(input_file):
        print(f"Input file {input_file} does not exist.")
        return unique_users

    with open(input_file, mode='r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row
        for row in reader:
            try:
                user_id = row[1]
                user_name = row[2]
                unique_users.add((user_id, user_name))
            except IndexError:
                continue

    return unique_users

if __name__ == "__main__":
    unique_users = get_unique_user_ids(INPUT_FILE)
    
    if unique_users:
        with open(OUTPUT_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["User ID", "Name"])
            writer.writerows(unique_users)
        print(f"Saved unique user IDs and names to {OUTPUT_FILE}")
    else:
        print("No unique user IDs found.")