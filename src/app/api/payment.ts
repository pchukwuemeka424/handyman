import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate a unique transaction reference
    const txRef = `T-${Date.now()}`;

    // Prepare the payment payload
    const paymentData = {
      tx_ref: txRef, // Unique reference per transaction
      amount: 7500, // Numeric amount for the payment
      currency: 'NGN',
      redirect_url: 'https://example_company.com/success', // Redirect after payment
      customer: {
        email: 'developers@flutterwavego.com', // Replace with customer email
        name: 'Flutterwave Developers',      // Replace with customer name
        phonenumber: '09012345678',            // Replace with customer phone number
      },
      customizations: {
        title: 'Flutterwave Standard Payment',
      },
    };

    // Set the request headers
    const headers = {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Ensure your secret key is set in env
      'Content-Type': 'application/json',
    };

    // Send the POST request to Flutterwave API
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      paymentData,
      { headers }
    );

    // Check if the request was successful
    if (response.status === 200 && response.data.status === 'success') {
      return res.status(200).json({ status: 'success', data: response.data });
    } else {
      return res.status(400).json({
        status: 'failure',
        message: response.data.message || 'Payment failed',
      });
    }
  } catch (error) {
    // Log error details for debugging
    console.error('Error with payment API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Payment request failed' });
  }
}
