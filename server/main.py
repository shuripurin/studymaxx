from flask import Flask, jsonify, request
import os
from google.genai import types

from llm import initialize_genai_client, get_groq_response

import json

# search
from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch

from pydantic import BaseModel

from dashboard import create_dashboard  # Import the dashboard creation function

from flask_cors import CORS  # Import Flask-CORS

from groq import Groq

import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load .env only in local development
if os.environ.get("FLASK_ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

google_search_tool = Tool(
    google_search = GoogleSearch()
)

SCOPES = ["https://www.googleapis.com/auth/calendar"]

app = Flask(__name__)
#CORS(app, origins=["http://localhost:5173", "https://studymaxx.vercel.app"])  # Enable CORS for specific origins
# allow all origins
CORS(app, origins=["*"])  # Enable CORS for all origins

gemini_client = initialize_genai_client()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("fire-5a6ba-e3c9ccfcc757.json")

firebase_admin.initialize_app(cred)

db = firestore.client()

# Read the contents of config.txt as a string
config_file_path = os.path.join(os.path.dirname(__file__), "config.txt")
try:
    with open(config_file_path, "r") as config_file:
        config_content = config_file.read()
except FileNotFoundError:
    config_content = "Config file not found."

def get_calendar_service():
    """Authenticate and return the Google Calendar service."""
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return build("calendar", "v3", credentials=creds)

@app.route("/api/calendar/create_event", methods=["GET"])
def create_event_route():
    """Route to create a hardcoded Google Calendar event."""
    try:
        # Hardcoded event details for testing
        event = {
            'summary': 'Beaverhacks Meeting',
            'location': 'Corvallis, Oregon, USA',
            'description': 'A chance to collaborate on Beaverhacks projects.',
            'start': {
                'dateTime': '2025-04-06T09:00:00-07:00',  # Sunday, 9:00 AM Pacific Time
                'timeZone': 'America/Los_Angeles',
            },
            'end': {
                'dateTime': '2025-04-06T10:00:00-07:00',  # Sunday, 10:00 AM Pacific Time
                'timeZone': 'America/Los_Angeles',
            },
            'attendees': [
                {'email': 'attendee1@example.com'},
                {'email': 'attendee2@example.com'},
            ],
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},  # Reminder 1 day before
                    {'method': 'popup', 'minutes': 10},      # Reminder 10 minutes before
                ],
            },
        }

        # Get the Google Calendar service
        service = get_calendar_service()

        # Insert the event into the calendar
        event_result = service.events().insert(calendarId='primary', body=event).execute()

        # Return the event link as a response
        return jsonify({"message": "Event created successfully", "event_link": event_result.get("htmlLink")})

    except HttpError as error:
        return jsonify({"error": f"An error occurred: {error}"}), 500

@app.route("/")
def hello_world():
    return "<p>2025 Beaverhacks!</p>"

@app.route('/api/gemini/preferences')
def preferences():
    # Fetch a single document from Firestore
    doc_ref = db.collection("users").document("guest")  # Replace "guest" with the desired document ID
    doc = doc_ref.get()

    if (doc.exists):
        return jsonify(doc.to_dict())  # Return the document's data as JSON
    else:
        return jsonify({"error": "Document not found"}), 404

@app.route('/api/gemini/chat', methods=['POST'])
def chat_with_gemini():
    data = request.get_json()
    message = data.get("message")
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            response_modalities=["TEXT"],
            system_instruction="You are a mentor.",
            temperature=0,
        ),
        contents=[message]
    )
    return jsonify({"response": response.candidates[0].content.parts[0].text})

@app.route('/api/gemini/conv', methods=['POST'])
def get_gemini_response():
    """Fetches a response from the Gemini API."""
    #message = "I want to become a software engineer."
    data = request.get_json()
    message = data.get("message")
    new_message = get_groq_response(groq_client, message)
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            tools=[google_search_tool],
            response_modalities=["TEXT"],
            system_instruction="You need to come up with a learning plan given the following goal.",
            temperature=0,
        ),
        contents= ["This is the user message" + message + "This is groq output from that message" + new_message + "Use the following schema exactly for the output, it's a json:" + config_content]
    )
    
    # Extract the text from the response
    if response.candidates and response.candidates[0].content.parts:
        response_text = response.candidates[0].content.parts[0].text
    else:
        response_text = "No response generated."
    
    #breakpoint()
    if response.candidates and response.candidates[0].content.parts:
        response_graph = response.candidates[0].content.parts[1].text
    else:
        response_graph = "No response generated."
    
    # Write the extracted text to a new config.txt file
    new_config_file_path = os.path.join(os.path.dirname(__file__), "new_config.txt")
    with open(new_config_file_path, "w") as new_config_file:
        new_config_file.write(response_graph)
    # Return the extracted text as a JSON response
    #return jsonify({"response": response_text})
    #result = jsonify({"response": response_graph})
        # Read the file and remove the first and last lines
    #breakpoint()
    with open(new_config_file_path, "r") as file:
        lines = file.readlines()
        json_content = "".join(lines[1:-1])  # Skip the first and last lines

    # Parse the JSON content
    try:
        # Check if the content already starts and ends with braces
        if not json_content.strip().startswith("{") or not json_content.strip().endswith("}"):
            # Add braces if they are missing
            json_content = "{" + json_content.strip() + "}"
        
        # Parse the JSON content
        parsed_json = json.loads(json_content.strip())
    except json.JSONDecodeError as e:
        return jsonify({"error": "Invalid JSON format", "details": str(e)}), 400
    #breakpoint()
    # Return the parsed JSON as a response
    return jsonify(parsed_json)

    return result

# Integrate the Dash app
create_dashboard(app)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)  # Use port 5001 for the new server
