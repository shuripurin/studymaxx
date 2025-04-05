from flask import Flask, jsonify, request
import os
from google.genai import types

from llm import initialize_genai_client

# Load .env only in local development
if os.environ.get("FLASK_ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

app = Flask(__name__)
gemini_client = initialize_genai_client()

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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
