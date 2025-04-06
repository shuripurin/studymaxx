import os
import google.generativeai as genai
from groq import Groq

# Initialize Google GenAI client with a valid model
def initialize_genai_client():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY is not set.")
    genai.configure(api_key=api_key)

    # Choose a model that exists, like from your list_models() output
    return genai.GenerativeModel("models/gemini-1.5-pro-latest")

# Generate content using Google GenAI (image-based input)
def generate_genai_content(client, uri):
    prompt = "What is shown in this image? Be specific and include names, uses, and part numbers."
    response = client.generate_content(
        contents=[
            {"role": "user", "parts": [prompt]},
            {"role": "user", "parts": [{"file_data": {"file_uri": uri}, "mime_type": "image/jpeg"}]},
        ],
        generation_config={
            "temperature": 0,
        }
    )
    return response

# Generate a summary using Groq
def get_groq_response(client, message):
    prompt = (
        "You are a mentor. Give a short summary for Gemini input from the following message: " + message
    )
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-70b-8192"
    )
    return chat_completion.choices[0].message.content
