const axios = require('axios');

// Test webhook endpoint locally
const testWebhook = async () => {
  const testPayload = {
    object: 'page',
    entry: [
      {
        id: '123456789',
        time: Date.now(),
        changes: [
          {
            field: 'leadgen',
            value: {
              leadgen_id: '987654321',
              page_id: '123456789',
              form_id: '111222333',
              adgroup_id: '444555666',
              ad_id: '777888999',
              created_time: Math.floor(Date.now() / 1000)
            }
          }
        ]
      }
    ]
  };

  try {
    console.log('Sending test webhook payload...');
    const response = await axios.post('http://localhost:3000/webhook', testPayload);
    console.log('Response:', response.status, response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testWebhook();
