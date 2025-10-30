# Complete Setup Guide - Facebook Lead Ads Webhook

## Step 1: Subscribe to Leadgen Field

In your Facebook App's Webhook configuration:

1. Go to **Webhooks** product
2. Find the **`leadgen`** field in the list
3. Click the **"Subscribe"** button next to it
4. It should change from "Unsubscribed" to "Subscribed"

## Step 2: Install App on Your Facebook Page

You need to connect your app to your Facebook Page. Use the **Graph API Explorer**:

### Method 1: Using Graph API Explorer (Easiest)

1. Go to: https://developers.facebook.com/tools/explorer
2. Select your app from the "Meta App" dropdown
3. Click **"Generate Access Token"** or **"Get Token"** > **"Get User Access Token"**
4. Select these permissions:
   - `leads_retrieval`
   - `pages_manage_metadata`
   - `pages_show_list`
   - `pages_read_engagement`
   - `ads_management`
5. Click **"Generate Access Token"** and authorize
6. Click **"Get Token"** again > Select your **Facebook Page**
7. Now you have a Page Access Token

### Method 2: Subscribe Page to App

Still in Graph API Explorer:

1. Change the HTTP method from `GET` to **`POST`**
2. In the query field, enter: `YOUR_PAGE_ID/subscribed_apps?subscribed_fields=leadgen`
   - Replace `YOUR_PAGE_ID` with your actual Page ID (found in Page settings or About section)
3. Click **"Submit"**
4. You should see response: `{"success": true}`

**Example:**
```
POST: 122178921056459407/subscribed_apps?subscribed_fields=leadgen
Response: {"success": true}
```

## Step 3: Get Your Page ID

If you don't know your Page ID:

1. Go to your Facebook Page
2. Click **"About"** tab
3. Scroll down to find "Page ID" or "Page transparency"
4. OR use Graph API Explorer: `GET` request to `me?fields=id,name` with Page Access Token

## Step 4: Add Environment Variables to Render

In your Render dashboard:

1. Go to your service
2. Click **"Environment"** tab
3. Add these variables:
   - `VERIFY_TOKEN` = `edsfsdfsdfewwtwegevwrwgre`
   - `ACCESS_TOKEN` = (Your Page Access Token from Step 2)
   - `PAGE_ID` = (Your Page ID from Step 3)
4. Click **"Save Changes"** (this will redeploy)

## Step 5: Verify Everything is Connected

### Check if Page is Subscribed

In Graph API Explorer:
1. Method: `GET`
2. Query: `YOUR_PAGE_ID/subscribed_apps`
3. Submit

You should see your app listed:
```json
{
  "data": [
    {
      "name": "Your App Name",
      "id": "your-app-id"
    }
  ]
}
```

### Check Subscribed Fields

In Graph API Explorer:
1. Method: `GET`
2. Query: `YOUR_APP_ID/subscriptions`
3. Submit

You should see:
```json
{
  "data": [
    {
      "object": "page",
      "callback_url": "https://fb-leads-30g0.onrender.com/webhook",
      "fields": ["leadgen"],
      "active": true
    }
  ]
}
```

## Step 6: Create a Test Lead Ad

1. Go to **Facebook Ads Manager**: https://www.facebook.com/adsmanager
2. Create a new campaign > Choose **"Lead generation"** objective
3. Create an ad set and select your Facebook Page
4. Create a Lead Form:
   - Add questions (name, email, phone, etc.)
   - Preview and test
5. **Fill out the form** as a test user
6. Check your **Render logs** - you should see the lead data!

## Troubleshooting

### Not receiving webhooks?

1. **Check if leadgen is subscribed** in Webhooks product
2. **Verify Page is subscribed to app**: `GET YOUR_PAGE_ID/subscribed_apps`
3. **Check callback URL** is exactly: `https://fb-leads-30g0.onrender.com/webhook`
4. **Verify environment variables** are set in Render
5. **Check Render logs** for any errors

### "Test" button not working?

- The test button often sends empty payloads
- Create a REAL lead ad and fill it out to test properly

### Access Token errors?

- Make sure you're using a **Page Access Token**, not User Access Token
- Token must have all required permissions
- For production, get a long-lived token (60 days)

## Getting a Long-Lived Token (Production)

For production, get a token that lasts 60 days:

1. Use the short-lived token from Graph API Explorer
2. Exchange it for long-lived token:
   ```
   GET /oauth/access_token?  
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```
3. Use the returned long-lived token in your `.env`

## Summary Checklist

- [ ] Webhooks product added to app
- [ ] Callback URL set to `https://fb-leads-30g0.onrender.com/webhook`
- [ ] Verify token matches your `.env`
- [ ] `leadgen` field is **subscribed**
- [ ] Page Access Token generated with all permissions
- [ ] App installed on Page (`POST PAGE_ID/subscribed_apps`)
- [ ] Environment variables added to Render
- [ ] Test lead ad created and submitted
- [ ] Logs showing lead data

Once all checked, you're ready to receive live leads! 🎉
