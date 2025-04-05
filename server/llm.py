import os
import google.generativeai as genai

# Initialize Google GenAI client
def initialize_genai_client():
    # Configure using API key from environment variable
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    return genai

# Generate content using Google GenAI
def generate_genai_content(client, uri, model="models/gemini-pro-vision"):
    prompt = "What is shown in this image? Be specific and include names, uses, and part numbers."

    response = client.generate_content(
        model=model,
        contents=[
            {"role": "user", "parts": [prompt]},
            {"role": "user", "parts": [{"file_data": {"file_uri": uri}, "mime_type": "image/jpeg"}]},
        ],
        generation_config={
            "temperature": 0,
        }
    )
    return response
