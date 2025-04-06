import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def main():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)
        list_calendars(service)  # Optional: List calendars
        create_event(service)   # Create a new event
    except HttpError as error:
        print(f"An error occurred: {error}")


def list_calendars(service):
    calendar_list = service.calendarList().list().execute()
    for calendar in calendar_list["items"]:
        print(f"Calendar ID: {calendar['id']}, Summary: {calendar['summary']}")


def create_event(service):
    """Creates an event in the user's primary calendar."""
    event = {
        'summary': 'Beaverhacks Meeting',
        'location': '123 Main St, Springfield, USA',
        'description': 'A chance to collaborate on Beaverhacks projects.',
        'start': {
            'dateTime': '2025-04-06T09:00:00-07:00',  # Sunday, 9:00 AM Pacific Time
            'timeZone': 'America/Los_Angeles',        # Pacific Time Zone
        },
        'end': {
            'dateTime': '2025-04-06T10:00:00-07:00',  # Sunday, 10:00 AM Pacific Time
            'timeZone': 'America/Los_Angeles',        # Pacific Time Zone
        },
        'attendees': [
            {'email': 'attendee1@example.com'},
            {'email': 'attendee2@example.com'},
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},  # Reminder 1 day before
                {'method': 'popup', 'minutes': 10},      # Reminder 10 minutes before
            ],
        },
    }

    try:
        event_result = service.events().insert(calendarId='primary', body=event).execute()
        print(f"Event created: {event_result.get('htmlLink')}")
    except HttpError as error:
        print(f"An error occurred: {error}")


if __name__ == "__main__":
  main()