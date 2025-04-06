import requests


def main():
    #base_url = "http://127.0.0.1:5000"  # Update this URL if your Flask server is running on a different address or port
    #base_url = "https://flask-backend-774923128692.us-west1.run.app/"
    #base_url = "https://69a2-128-193-154-97.ngrok-free.app/"
    #breakpoint()
    #base_url = "https://c680-128-193-154-97.ngrok-free.app/"
    base_url = "http://127.0.0.1:5001"
    planner = True
    if planner:
        message = "I want to become a software engineer."
        response = requests.post(f"{base_url}/api/gemini/conv", json={"message": message})
        #response = requests.get(f"{base_url}/api/gemini/conv")
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    else:
        message = "I don't understand dynamic programming. Can you help me?"
        response = requests.post(f"{base_url}/api/gemini/chat", json={"message": message})
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())

if __name__ == "__main__":
    main()