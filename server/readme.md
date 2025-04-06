# Backend code for 2025 Beaverhacks
Backend python flask code to interact with Gemini AI API

## Setup

### Installation
```bash
git git@github.com:shuripurin/studymaxx.git
cd flask-backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
git checkout -b new-branch-name
```

## Starting the backend server and test it
```bash
bash start.sh
ngrok http 5000
python test_backend.py
```

## Production
flask debug should be set to 0

## Dashboard
https://c680-128-193-154-97.ngrok-free.app/dashboard/