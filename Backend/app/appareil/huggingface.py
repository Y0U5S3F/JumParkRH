import os
import json
import requests
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")
# Load environment variables from .env file

SQL_MODEL_URL = "https://api-inference.huggingface.co/models/defog/sqlcoder-7b-2"
CHATBOT_MODEL_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
API_KEY = os.getenv("HUGGINGFACE_API_KEY")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# PostgreSQL Connection Setup
DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PWD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

# Function to send request to Hugging Face model
def query_huggingface_model(model_url, input_text):
    data = {"inputs": input_text}
    response = requests.post(model_url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed with status {response.status_code}: {response.text}"}

# Function to execute SQL query in PostgreSQL
def execute_sql_query(sql_query):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute(sql_query)
        results = cursor.fetchall()
        conn.commit()
        cursor.close()
        conn.close()
        return results
    except Exception as e:
        return {"error": str(e)}

# Function to generate chatbot response based on SQL results
def get_chatbot_response(sql_results):
    formatted_results = json.dumps(sql_results)  # Convert to string for input
    response = query_huggingface_model(CHATBOT_MODEL_URL, f"Analyze this SQL result: {formatted_results}")
    return response

# Main Function
def main():
    user_input = input("Enter your request: ")  # Example: "Show me all users older than 30"

    # Step 1: Convert User Input to SQL Query
    sql_response = query_huggingface_model(SQL_MODEL_URL, user_input)
    if "error" in sql_response:
        print("SQL Generation Error:", sql_response["error"])
        return

    sql_query = sql_response[0]["generated_text"]
    print(f"Generated SQL Query: {sql_query}")

    # Step 2: Execute SQL Query on PostgreSQL
    sql_results = execute_sql_query(sql_query)
    if "error" in sql_results:
        print("Database Error:", sql_results["error"])
        return

    print("SQL Query Results:", sql_results)

    # Step 3: Send SQL Results to Chatbot for Analysis
    chatbot_response = get_chatbot_response(sql_results)
    if "error" in chatbot_response:
        print("Chatbot Error:", chatbot_response["error"])
        return

    final_response = chatbot_response[0]["generated_text"]
    print("\nChatbot Response:", final_response)

# Run the script
if __name__ == "__main__":
    main()
