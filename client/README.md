# React + Vite

# Steps to start the project:
- npm install
- npm run dev

Google Sheets API allows reading data with an API key (GET requests), but writing/updating data (PUT requests) requires authentication via OAuth2.
Issue: "API keys are not supported by this API" (401 Unauthorized)

Fetching data (GET) → Works with apiKey ✅
Updating data (PUT) → Requires OAuth2 authentication ❌ (API key won't work)

Solution: Use a Service Account or OAuth2
You need to use OAuth2 authentication instead of an API key. There are two common methods:

Using a Service Account (Best for Backend Automation)

Generate a Google Service Account.
Share the Google Sheet with the Service Account email.
Use google-auth-library to get a token and send authorized requests.
Using OAuth2 for User Authentication (Best for User Actions)

Users log in with their Google account.
Get an access token.
Send the token with API requests.

 Recommended Fix: Using a Service Account (Backend)
You'll need:

Create a Service Account on Google Cloud.
Generate a JSON key file.
Use the Service Account to authenticate API requests

Steps to Set Up Service Account
Go to Google Cloud Console

Open: Google Cloud Console
Select your project (or create one).
Enable Google Sheets API

Navigate to APIs & Services → Enable APIs & Services.
Search for Google Sheets API and enable it.
Create a Service Account

Go to APIs & Services → Credentials.
Click Create Credentials → Service Account.
Fill in the details and click Create.
Generate a JSON Key

Click on your new Service Account.
Navigate to Keys → Add Key → JSON.
A JSON file will be downloaded (keep it safe).
Share Your Google Sheet with the Service Account

Open your Google Sheet.
Click Share.
Add the Service Account Email (found in the JSON file).
Give Editor access.

HAPPY CODING