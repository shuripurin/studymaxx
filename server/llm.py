import os
import base64
from google import genai
from google.genai.types import HttpOptions, Part
from google.genai import types
from groq import Groq
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch

# Initialize Google GenAI client
def initialize_genai_client():
    project = os.getenv("GOOGLE_CLOUD_PROJECT")
    location = os.getenv("GOOGLE_CLOUD_LOCATION")
    return genai.Client(
        http_options=HttpOptions(api_version="v1"),
        vertexai=True,
        project=project,
        location=location
    )

# Generate content using Google GenAI
def generate_genai_content(client, uri, model="gemini-2.5-pro-exp-03-25"):
    response = client.models.generate_content(
        model=model,
        contents=[
            "What is shown in this image?",
            Part.from_uri(
                file_uri=uri,
                mime_type="image/jpeg",
            ),
        ],
        config=types.GenerateContentConfig(
            system_instruction="Describe the objects in sentences, be very specific, giving the name, usage, and part number.",
            temperature=0,
        ),
    )
    return response