// This file simulates environment variables for the frontend.
// In a real production environment, these would be set through a build process or environment configuration.

// IMPORTANT: Replace the placeholder value with your actual Google Client ID.
// You can get this from the Google Cloud Console: https://console.cloud.google.com/apis/credentials

window.process = {
  env: {
    GOOGLE_CLIENT_ID: '309111195475-45ooqa01hc9cfnh41evps2qkqvsglpnt.apps.googleusercontent.com',

    // This API key is used for both Google GenAI (Gemini) and other Google Cloud APIs like YouTube Data API.
    // Ensure this key is properly restricted in your Google Cloud Console (e.g., by HTTP referrers).
    API_KEY: 'AIzaSyDWXFIXNc_LvwwFI9ez6akk5AIp7u-a6Dw'
  }
};
