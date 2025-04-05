import requests
#from main import app


def main():
    base_url = "http://127.0.0.1:5000"  # Update this URL if your Flask server is running on a different address or port
    #base_url = "https://flask-backend-774923128692.us-west1.run.app/"
    #message = "What is an LLM?"
    #response = requests.get(f"{base_url}/api/groq?message={message}")
    breakpoint()
    response = requests.get(f"{base_url}/api/gemini/conv")
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
    
if __name__ == "__main__":
    main()