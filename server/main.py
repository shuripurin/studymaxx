from flask import Flask, jsonify, request
import os
from google.generativeai import types
from firebase_config import initialize_firebase
from firebase_admin import auth
from llm import initialize_genai_client

# Load .env only in local development
if os.environ.get("FLASK_ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize clients
gemini_client = initialize_genai_client()
initialize_firebase()

@app.route("/")
def hello_world():
    return "<p>2025 Beaverhacks!</p>"

@app.route('/api/gemini/conv')
def get_gemini_response():
    """Fetches a response from the Gemini API."""
    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction="You need to come up with a learning plan given the following goal.",
            temperature=0,
        ),
        contents=["I want to become a software engineer"]
    )

    # Extract the text from the response
    if response.candidates and response.candidates[0].content.parts:
        response_text = response.candidates[0].content.parts[0].text
    else:
        response_text = "No response generated."

    # Return the extracted text as a JSON response
    return jsonify({"response": response_text})

@app.route('/api/auth/verify-token', methods=['POST'])
def verify_token():
    """Verifies the Firebase ID token from frontend."""
    try:
        id_token = request.json.get("idToken")
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get("email", "")
        return jsonify({"uid": uid, "email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
