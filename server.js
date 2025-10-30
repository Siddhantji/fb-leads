require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Root path to check server status
app.get('/', (req, res) => {
  res.send('Facebook Leads Server is running!');
});

// Webhook verification (GET request)
app.get('/webhook', (req, res) => {
  console.log('=== WEBHOOK GET REQUEST (Verification) ===');
  console.log('Query params:', req.query);
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Webhook for receiving leads (POST request)
app.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log('='.repeat(60));
  console.log(`[${timestamp}] WEBHOOK POST REQUEST RECEIVED`);
  console.log('='.repeat(60));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body is empty?', Object.keys(req.body || {}).length === 0);
  console.log('='.repeat(60));
  
  const body = req.body;
  
  // Always respond with 200 first to acknowledge receipt
  res.status(200).send('EVENT_RECEIVED');
  
  // Check if body exists and has content
  if (!body || Object.keys(body).length === 0) {
    console.log('⚠️  Empty body received - this might be a test ping from Facebook');
    return;
  }

  // Check if this is an event from a page subscription
  if (body.object === 'page') {
    console.log('✓ Valid page object detected');

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      console.log(`Processing entry ID: ${entry.id}, Time: ${entry.time}`);
      // Handle the lead generation event
      if (entry.messaging || entry.changes) {
        console.log(`Entry has ${entry.changes ? entry.changes.length : 0} changes`);
        entry.changes.forEach(async function(change) {
          console.log('Processing change:', JSON.stringify(change, null, 2));
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            console.log('New lead generated:', leadgenId);
            console.log('Full lead value:', JSON.stringify(change.value, null, 2));
            // Retrieve the lead details
            if (!process.env.ACCESS_TOKEN || process.env.ACCESS_TOKEN === 'your_access_token_here') {
              console.warn('⚠️  ACCESS_TOKEN not configured! Skipping lead retrieval.');
            } else {
              try {
                console.log(`Fetching lead details for ID: ${leadgenId}...`);
                const response = await axios.get(`https://graph.facebook.com/v18.0/${leadgenId}?access_token=${process.env.ACCESS_TOKEN}`);
                console.log('✓ Lead details retrieved successfully:');
                console.log(JSON.stringify(response.data, null, 2));
              } catch (error) {
                console.error('✗ Error retrieving lead details:', error.response ? error.response.data : error.message);
              }
            }
          }
        });
      }
    });
  } else {
    console.log(`✗ Invalid object type: ${body.object}`);
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Verify Token is set: ${!!process.env.VERIFY_TOKEN}`);
  console.log(`Access Token is set: ${!!process.env.ACCESS_TOKEN}`);
});