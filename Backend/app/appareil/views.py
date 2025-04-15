from django.shortcuts import render
from rest_framework import generics
from .models import Appareil
from .serializers import AppareilSerializer
import psycopg2
from openai import OpenAI
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework import status
import re

load_dotenv(dotenv_path='../.env')  # Load environment variables from .env file


class AppareilListCreateView(generics.ListCreateAPIView):
    queryset = Appareil.objects.all()
    serializer_class = AppareilSerializer

class AppareilRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appareil.objects.all()
    serializer_class = AppareilSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def AIChatBot(request):

    # PostgreSQL connection details
    DB_CONFIG = {
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PWD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
    }

    # OpenAI credentials and settings
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    ENDPOINT = os.getenv("CHATBOT_ENDPOINT")
    MODEL_NAME = os.getenv("CHATBOT_MODEL_NAME")

    client = OpenAI(base_url=ENDPOINT, api_key=GITHUB_TOKEN)

    # Get user query from the body of the request (message field)
    user_query = request.data.get('message', '')

    if not user_query:
        return Response({"error": "No message provided."}, status=status.HTTP_400_BAD_REQUEST)

    def get_table_schema(as_string=False):
        """Fetch all table names and their columns from the PostgreSQL database."""
        schema_info = {}
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cursor = conn.cursor()

            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_type='BASE TABLE';
            """)
            tables = [row[0] for row in cursor.fetchall()]

            for table in tables:
                cursor.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = %s;
                """, [table])
                columns = cursor.fetchall()
                schema_info[table] = columns

            cursor.close()
            conn.close()

        except Exception as e:
            print("Error fetching schema:", e)
            return None

        if as_string:
            lines = []
            for table, columns in schema_info.items():
                lines.append(f"\nTable: {table}")
                for col_name, data_type in columns:
                    lines.append(f"  - {col_name}: {data_type}")
            return "\n".join(lines)

        return schema_info

    # Pre-fetch and store the schema
    schema_info = get_table_schema(as_string=True)

    def generate_sql_query(user_query):
        """Generate an SQL query using OpenAI's model based on user input and schema."""
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes SQL queries based on user requests.(employe_employe uses matricule instead of id)"},
                {"role": "user", "content": f"Here is the schema of the database:\n{schema_info}\n\nPlease generate a SQL query for the following request: {user_query}"}
            ],
            model=MODEL_NAME,
        )

        sql_query = response.choices[0].message.content.strip()
        return sql_query

    def extract_sql_query_from_response(response):
        """Extract the SQL query between ```sql and ```."""
        match = re.search(r'```sql(.*?)```', response, re.DOTALL)
        if match:
            return match.group(1).strip()
        return None

    def execute_sql_query_and_return_string(sql_query):
        """Execute the SQL query on the PostgreSQL database and return a string with all results."""
        try:
            clean_sql_query = extract_sql_query_from_response(sql_query)
            if clean_sql_query is None:
                return "No valid SQL query found."

            conn = psycopg2.connect(**DB_CONFIG)
            cursor = conn.cursor()

            cursor.execute(clean_sql_query)
            rows = cursor.fetchall()

            if rows:
                result_str = "\n".join([str(row) for row in rows])
            else:
                result_str = "No results found."

            cursor.close()
            conn.close()

        except Exception as e:
            result_str = f"Error executing SQL query: {e}"

        return result_str

    def humanize_sql_results(user_query, sql_results):
        """Send the user query and SQL results to OpenAI for human-friendly formatting."""
        response = client.chat.completions.create(
            messages=[
                {"role": "system",  "content": "You are a helpful assistant that summarizes SQL query results clearly and concisely for users. Always respond in a professional tone, without emojis or unnecessary wording. NEVER return sensitive information such as passwords, emails, login credentials, or any other confidential data. Use the same language as the user's query."},
                {"role": "user", "content": f"Here is the user query: '{user_query}'\n\nHere are the raw SQL results: {sql_results}\n\nPlease humanize and format the results in a user-friendly way."}
            ],
            model=MODEL_NAME,
        )

        return response.choices[0].message.content.strip()

    # Generate SQL query, execute it, and humanize results
    sql_query = generate_sql_query(user_query)
    sql_results = execute_sql_query_and_return_string(sql_query)
    humanized_results = humanize_sql_results(user_query, sql_results)

    # Return the humanized results as JSON response
    return Response({"result": humanized_results})