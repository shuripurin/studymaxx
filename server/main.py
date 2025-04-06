from flask import Flask, jsonify, request
import os
import json
from firebase_config import initialize_firebase
from firebase_admin import auth
from llm import initialize_genai_client, get_groq_response
from flask_cors import CORS
from groq import Groq

# Load .env only in local development
if os.environ.get("FLASK_ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["*"])

# Clients
gemini_model = initialize_genai_client()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
initialize_firebase()

# Load config
config_file_path = os.path.join(os.path.dirname(__file__), "config.txt")
try:
    with open(config_file_path, "r") as config_file:
        config_content = config_file.read()
except FileNotFoundError:
    config_content = "Config file not found."

@app.route("/")
def hello_world():
    return "<p>2025 Beaverhacks!</p>"

@app.route('/api/auth/verify-token', methods=['POST'])
def verify_token():
    try:
        id_token = request.json.get("idToken")
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get("email", "")
        return jsonify({"uid": uid, "email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route('/api/gemini/conv')
def get_gemini_response():
    try:
        message = "I want to become a software engineer."
        new_message = get_groq_response(groq_client, message)

        prompt = (
            "You need to come up with a learning plan given the following goal.\n\n"
            "This is the user message: " + message + "\n"
            "This is Groq output from that message: " + new_message + "\n"
            "Use the following schema exactly for the output, it's a JSON:\n" + config_content
        )

        # Proper way: no 'system_instruction'
        response = gemini_model.generate_content(
            contents=[{"role": "user", "parts": [prompt]}],
            generation_config={
                "temperature": 0,
                "top_p": 1,
                "max_output_tokens": 1024,
            }
        )

        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
