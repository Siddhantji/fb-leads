# Facebook Leads Retriever

A Node.js application to retrieve Facebook leads in real-time using webhooks.

## Prerequisites

- Node.js installed
- Facebook Developer Account
- A Facebook Page with Lead Ads enabled

## Permissions Needed

To access Facebook leads, your Facebook App needs the following permissions:

- `leads_retrieval`: Allows your app to retrieve leads from lead generation forms.
- `pages_manage_metadata`: Allows your app to manage metadata for pages.
- `pages_show_list`: Allows your app to show the list of pages.
- `pages_read_engagement`: Allows your app to read engagement data for pages.
- `ads_management`: Allows your app to manage ads.

## Steps to Set Up

### 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/).
2. Create a new app or use an existing one.
3. Choose "Business" as the app type.

### 2. Add Webhooks Product

1. In your app dashboard, go to "Products" > "Add Product".
2. Search for and add "Webhooks".
3. In the Webhooks product, click "Setup".
4. Choose "Page" as the object and subscribe to the "leadgen" field.
5. Set the Callback URL to your server's public URL followed by `/webhook` (e.g., `https://yourdomain.com/webhook` or `https://abc123.ngrok.io/webhook` for local testing).
6. Set Verify Token (this will be used in your environment variables).

### 4. Get Access Token

1. Go to "Tools & Support" > "Graph API Explorer".
2. Select your app and generate a User Access Token with `leads_retrieval`, `pages_manage_metadata`, `pages_show_list`, `pages_read_engagement`, `ads_management` permissions.
3. For production, use a Page Access Token or App Access Token.

### 5. Install App on Page

1. Use the Graph API Explorer to install your app on the Facebook Page.
2. Make a POST request to `/{page-id}/subscribed_apps?subscribed_fields=leadgen&access_token={page-access-token}`.
3. This subscribes the page to leadgen notifications.

### 6. Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`) and set the following:

- `VERIFY_TOKEN`: The verify token you set in the webhook configuration.
- `ACCESS_TOKEN`: Your Facebook access token.
- `PAGE_ID`: The ID of your Facebook Page.

### 7. Install Dependencies

```bash
npm install
```

### 8. Run the Server

```bash
npm start
```

The server will run on port 3000 by default. You can access it at `http://localhost:3000` to see "Facebook Leads Server is running!"

#### Local Testing

For local development, use ngrok to expose your local server:

1. Install ngrok from [ngrok.com](https://ngrok.com/).
2. Run `ngrok http 3000` to get a public URL.
3. Use this URL as the Callback URL in your webhook configuration.

Make sure your webhook URL is accessible (use ngrok for local testing).

## How It Works

- The webhook endpoint `/webhook` handles incoming lead notifications.
- When a lead is generated, it logs the leadgen ID and automatically fetches the full lead details from the Facebook Graph API.
- The lead data is logged to the console for review.

## Testing

### Test Locally
```bash
node test-webhook.js
```

This sends a sample lead payload to your local server.

### Test on Render
Update the URL in `test-webhook.js` to your Render URL and run the script.

### Facebook Test Button
Note: Facebook's "Test" button may send an empty payload. To truly test:
1. **Create a real Lead Ad** on your Facebook Page
2. **Fill out the form** as a test user
3. **Check Render logs** for the actual lead data

The test button mainly verifies the webhook connection, not actual lead processing.

## Retrieving Lead Details

When a lead is generated, the webhook handler automatically retrieves the lead data using the Facebook Graph API. The code makes a GET request to:

```
GET https://graph.facebook.com/v18.0/{leadgen-id}?access_token={access-token}
```

The lead details, including form fields like name, email, etc., are logged to the console. You can modify the code to store them in a database or send notifications instead.

## Security

- Always use HTTPS for webhooks.
- Validate the webhook signature if possible.
- Store access tokens securely.

## License

ISC