TikTok Ads Creative Flow
A React-based web application for creating TikTok ad campaigns with OAuth integration and conditional validation logic.
Overview
This project demonstrates a simplified TikTok Ads Manager that allows users to connect their TikTok account and create ad campaigns with proper validation and error handling.
Features

OAuth Integration: Connect/disconnect TikTok Ads account (simulated)
Ad Creation Form: Create ads with campaign details
Conditional Music Logic:

Music is required for Conversion campaigns
Music is optional for Traffic campaigns


Music Options:

Use existing TikTok music ID
Upload custom music file
No music (only for Traffic objective)


Form Validation: Client-side validation with user-friendly error messages
Error Handling: Graceful handling of API failures and validation errors

Tech Stack

Frontend: React (Hooks)
Styling: Inline CSS
State Management: React useState

Installation & Setup
Prerequisites

Node.js (v14 or higher)
npm or yarn

Steps to Run Locally

Clone the repository

bash   git clone <your-repo-url>
   cd tiktok-ads-flow

Install dependencies

bash   npm install

Start the development server

bash   npm start

Open in browser

   http://localhost:3000
Project Structure
tiktok-ads-flow/
├── src/
│   ├── App.js          # Main application component
│   └── index.js        # Entry point
├── public/
├── package.json
└── README.md
How to Use
Step 1: Connect TikTok Account

Click "Connect TikTok Account" button
Wait for authentication (simulated 1-2 seconds)
You'll see a success message once connected

Step 2: Fill Ad Details

Campaign Name: Enter a name (min 3 characters)
Objective: Choose between Traffic or Conversions
Ad Text: Enter ad copy (max 100 characters)
Call to Action: Select from dropdown
Music: Choose one of three options based on objective

Step 3: Music Selection Rules

For Traffic Objective: Music is optional

Can select "No Music"
Can provide Music ID
Can upload custom music


For Conversions Objective: Music is REQUIRED

"No Music" option is disabled
Must either provide Music ID or upload music



Step 4: Submit

Click "Create Ad" button
Form validates all fields
Shows success message if ad is created
Shows error messages if validation fails

Validation Rules
FieldRuleCampaign NameRequired, minimum 3 charactersObjectiveRequired (Traffic or Conversions)Ad TextRequired, maximum 100 charactersCTARequiredMusicRequired for Conversions, optional for TrafficMusic IDMust start with a digit (for demo purposes)
Key Implementation Details
OAuth Flow (Simulated)
Since TikTok Ads API has geo-restrictions and requires developer account approval, I implemented a simulated OAuth flow that demonstrates the following:

Connect button initiates authentication
Mock user credentials are generated
Access token is stored in component state
Token can be disconnected/reconnected

In Production: This would integrate with actual TikTok OAuth endpoints:

Authorization endpoint: https://ads.tiktok.com/marketing_api/auth
Token exchange endpoint: https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/

Music Validation Logic
The core logic implements conditional validation:
javascriptif (objective === 'Conversions') {
  // Music is REQUIRED
  if (musicOption === 'no-music') {
    // Show error
  }
} else {
  // Music is OPTIONAL for Traffic
}
Error Handling
Errors are categorized into:

Field-level errors: Displayed inline below each field
Global errors: Displayed in banner at top of page
API errors: Simulated to show token expiry, validation failures

Assumptions & Shortcuts
Due to time constraints and API limitations, the following shortcuts were taken:

OAuth is Simulated:

Real TikTok OAuth requires developer account and may face geo-restrictions
Current implementation simulates the flow without actual API calls
Demonstrates understanding of OAuth flow


API Calls are Mocked:

TikTok Ads API endpoints are mocked
Music ID validation is simulated (accepts IDs starting with digits)
Ad creation returns mock success/failure


File Upload is Simulated:

File selection works but doesn't actually upload
Generates mock Music ID for uploaded files


No Backend:

All state is managed in frontend
Token stored in React state (not localStorage)



What Would Be Improved with More Time

Real OAuth Integration:

Set up TikTok Developer account
Implement actual authorization code flow
Handle OAuth callbacks properly


Backend Integration:

Node.js server to handle token exchange
Secure token storage
Actual API calls to TikTok Ads API


Enhanced Error Handling:

Retry logic for failed requests
Better error messages based on API responses
Loading states for async operations


UI/UX Improvements:

Better styling and responsive design
Loading animations
Success/error toast notifications
Form progress indicators


Testing:

Unit tests for validation logic
Integration tests for form submission
End-to-end testing



Known Limitations

OAuth is simulated and doesn't connect to real TikTok API
Music ID validation is basic (checks if starts with digit)
No persistent storage - data resets on page refresh
10% random API failure rate (for demonstration purposes)

If you have any doubts,you can reach out to me.