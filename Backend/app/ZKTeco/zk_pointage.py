import json
import os
from datetime import datetime

# File to store attendance sessions
LOG_FILE = "attendance_logs.json"

def load_sessions():
    """Load existing attendance sessions from the JSON file."""
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_sessions(sessions):
    """Save the sessions list back to the JSON file."""
    with open(LOG_FILE, "w") as f:
        json.dump(sessions, f, indent=4)

def process_attendance_event(uid, punch, event_time):
    """
    Processes an attendance event for a given UID.
    
    Parameters:
        uid (int): The employee UID.
        punch (int): 0 for checkin, 1 for checkout.
        event_time (datetime): The time of the event.
        
    Behavior:
      - If there is no previous session for this UID, creates a new one.
      - If the last session’s punch is different from the new event in the proper order 
        (checkin then checkout), it updates that session.
      - If the new event is the same as the last recorded event, it creates a new session.
    """
    sessions = load_sessions()
    new_event_iso = event_time.isoformat()

    # Find the latest session for this uid
    uid_sessions = [s for s in sessions if s.get("uid") == uid]
    if uid_sessions:
        # Sort by startDate (if present); if startDate is None, use endDate
        uid_sessions.sort(key=lambda s: s.get("startDate") or s.get("endDate") or "", reverse=True)
        last_session = uid_sessions[0]
        last_punch = last_session.get("lastPunch")
    else:
        last_session = None
        last_punch = None

    # Decide what to do based on last event and current event:
    #   0 = checkin, 1 = checkout
    if last_session:
        if last_punch == 0 and punch == 1:
            # Expected: checkin followed by checkout. If the current session doesn't have endDate, update it.
            if last_session.get("endDate") is None:
                last_session["endDate"] = new_event_iso
                last_session["lastPunch"] = punch
                print(f"[Update] UID {uid}: Checkin at {last_session['startDate']} updated with checkout at {new_event_iso}.")
            else:
                # If endDate is already set, then it is an anomaly: create a new session for checkout.
                new_session = {
                    "uid": uid,
                    "startDate": None,
                    "endDate": new_event_iso,
                    "lastPunch": punch
                }
                sessions.append(new_session)
                print(f"[Anomaly] UID {uid}: Duplicate checkout received. New session created with checkout at {new_event_iso}.")
        else:
            # For all other cases, create a new session.
            if punch == 0:
                # New checkin event.
                new_session = {
                    "uid": uid,
                    "startDate": new_event_iso,
                    "endDate": None,
                    "lastPunch": punch
                }
                sessions.append(new_session)
                print(f"[New] UID {uid}: New checkin at {new_event_iso} (previous event was checkin or checkout).")
            elif punch == 1:
                # New checkout event.
                new_session = {
                    "uid": uid,
                    "startDate": None,
                    "endDate": new_event_iso,
                    "lastPunch": punch
                }
                sessions.append(new_session)
                print(f"[New] UID {uid}: New checkout at {new_event_iso} (previous event was checkin or checkout).")
    else:
        # No existing session for this uid, so create a new session based on punch.
        if punch == 0:
            new_session = {
                "uid": uid,
                "startDate": new_event_iso,
                "endDate": None,
                "lastPunch": punch
            }
            sessions.append(new_session)
            print(f"[New] UID {uid}: First checkin at {new_event_iso}.")
        elif punch == 1:
            new_session = {
                "uid": uid,
                "startDate": None,
                "endDate": new_event_iso,
                "lastPunch": punch
            }
            sessions.append(new_session)
            print(f"[New] UID {uid}: First checkout at {new_event_iso}.")
    
    save_sessions(sessions)

# --- Example simulation of incoming events ---
if __name__ == "__main__":
    # Example events list (simulate events coming from the ZKTeco machine)
    example_events = [
        {"uid": 10, "punch": 0, "timestamp": "2025-02-28T08:00:00"},
        {"uid": 10, "punch": 1, "timestamp": "2025-02-28T12:00:00"},
        {"uid": 10, "punch": 0, "timestamp": "2025-02-28T13:00:00"},
        {"uid": 10, "punch": 1, "timestamp": "2025-02-28T17:00:00"},
        {"uid": 20, "punch": 0, "timestamp": "2025-02-28T09:00:00"},
        {"uid": 20, "punch": 0, "timestamp": "2025-02-28T09:30:00"},  # Duplicate checkin → new session
        {"uid": 20, "punch": 1, "timestamp": "2025-02-28T18:00:00"},
    ]
    
    for event in example_events:
        uid = event["uid"]
        punch = event["punch"]
        event_time = datetime.fromisoformat(event["timestamp"])
        process_attendance_event(uid, punch, event_time)
