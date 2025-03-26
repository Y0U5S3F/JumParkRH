import csv
import os
import aiohttp
import asyncio
from datetime import datetime

# Constants
DEVICE_API_URL = "http://127.0.0.1:8000/api/appareil/appareils/"
BATCH_SIZE = 50  # Adjust based on system capabilities

# In-memory caching [[4]]
user_data_cache = {}  # {user_id: data_id}
log_buffer = []  # For buffered writes [[5]]
processed_uids = []  # Track processed UIDs for batch marker update

async def read_last_uid(filename):
    """Read last processed UID using async file read [[3]]"""
    if os.path.exists(filename):
        async with aiohttp.ClientSession() as session:
            async with session.get(f'file://{filename}') as response:
                text = await response.text()
                first_line = text.split('\n', 1)[0].strip()
                return int(first_line) if first_line.isdigit() else 0
    return 0

async def update_last_uid(filename, uid):
    """Batch update marker file once per run [[8]]"""
    async with aiohttp.ClientSession() as session:
        async with session.post(f'file://{filename}', data=str(uid)) as response:
            return await response.text()

async def process_log_batch(log_batch, token):
    """Process batch of logs with async API calls [[6]]"""
    async with aiohttp.ClientSession() as session:
        tasks = []
        for log in log_batch:
            uid, user_id, punch, timestamp, event = log
            processed_uids.append(uid)
            
            if punch == 0:
                existing_id = user_data_cache.get(user_id)
                start_date = timestamp.isoformat()
                status = "anomalie" if existing_id else "present"
                
                # Batch create request
                tasks.append(send_label_data(session, user_id, start_date, status, token))
                
            elif punch in (4,5):
                data_id = user_data_cache.get(user_id)
                if data_id:
                    field = "endPause" if punch == 4 else "startPause"
                    value = timestamp.isoformat()
                    tasks.append(update_record(session, data_id, field, value, token))
                    tasks.append(update_status(session, data_id, 
                        "present" if punch == 4 else "en pause", token))
            
            elif punch == 1:
                data_id = user_data_cache.get(user_id)
                if data_id:
                    tasks.append(update_record(session, data_id, "endDate", 
                        timestamp.isoformat(), token))
                    tasks.append(update_status(session, data_id, "fin de service", token))
                    user_data_cache.pop(user_id, None)
        
        # Execute all API calls concurrently [[9]]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results and update cache/buffer
        for result in results:
            if isinstance(result, dict) and 'id' in result:
                user_data_cache[result['user_id']] = result['id']
                log_buffer.append((result['user_id'], result['id']))

async def send_label_data(session, user_id, start_date, status, token):
    """Async POST request with aiohttp [[6]]"""
    url = f"http://127.0.0.1:8000/api/label/labels/auto/{user_id}/"
    payload = {
        "startDate": start_date,
        "status": status
    }
    async with session.post(url, json=payload, headers={'Authorization': token}) as resp:
        return await resp.json()

async def update_record(session, data_id, field, value, token):
    """Async PUT request for field updates [[6]]"""
    url = f"http://127.0.0.1:8000/api/label/labels/data/{data_id}/"
    async with session.put(url, json={field: value}, 
                         headers={'Authorization': token}) as resp:
        return await resp.json()

async def update_status(session, data_id, status, token):
    """Separate status update handler"""
    url = f"http://127.0.0.1:8000/api/label/labels/data/{data_id}/"
    async with session.put(url, json={"status": status}, 
                         headers={'Authorization': token}) as resp:
        return await resp.json()

async def main():
    # Initial setup
    logs = [...]  # Load all logs at once [[2]]
    token = "Bearer ..."
    
    # Process in batches [[1]]
    for i in range(0, len(logs), BATCH_SIZE):
        batch = logs[i:i+BATCH_SIZE]
        await process_log_batch(batch, token)
        
        # Periodic buffer flush [[5]]
        if len(log_buffer) >= BATCH_SIZE:
            flush_buffer()
    
    # Final cleanup
    flush_buffer()
    await update_last_uid('marker.txt', max(processed_uids))

def flush_buffer():
    """Buffered file write operation [[5]]"""
    with open('logfile.csv', 'a') as f:
        writer = csv.writer(f)
        writer.writerows(log_buffer)
    log_buffer.clear()