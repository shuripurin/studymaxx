import firebase_admin
from firebase_admin import credentials, auth
import os

# Initialize the Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)