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

# Load .env only in local development
if os.environ.get("FLASK_ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

google_search_tool = Tool(
    google_search = GoogleSearch()
)

app = Flask(__name__)
#CORS(app, origins=["http://localhost:5173", "https://studymaxx.vercel.app"])  # Enable CORS for specific origins
# allow all origins
CORS(app, origins=["*"])  # Enable CORS for all origins

gemini_client = initialize_genai_client()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Read the contents of config.txt as a string
config_file_path = os.path.join(os.path.dirname(__file__), "config.txt")
try:
    with open(config_file_path, "r") as config_file:
        config_content = config_file.read()
except FileNotFoundError:
    config_content = "Config file not found."

@app.route("/")
def hello_world():
    return "<p>2025 Beaverhacks!</p>"

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
