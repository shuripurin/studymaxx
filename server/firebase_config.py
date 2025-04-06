import os
import firebase_admin
from firebase_admin import credentials
import json

def initialize_firebase():
    if not firebase_admin._apps:
        firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
        if not firebase_credentials:
            raise ValueError("Missing FIREBASE_CREDENTIALS environment variable.")
        cred_dict = json.loads(firebase_credentials)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
