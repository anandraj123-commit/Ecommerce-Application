import React from 'react';
import axios from 'axios';
import useRazorpay from "react-razorpay";
import { useNavigate } from 'react-router-dom';

const Payment = (props) => {
    const [Razorpay] = useRazorpay();
    const navigate = useNavigate();
   const navigationHandler = (path) => {
      navigate(path);
    };
    
    const apiUrl = process.env.REACT_APP_API_URL;

    const handlePayment = async () => {
        const orderUrl = `${apiUrl}/api/create-order`; // Adjust if different 'http://localhost:5001/api/create-order'
        const paymentVerificationUrl = `${apiUrl}/api/verify-payment`; // Adjust if different     'http://localhost:5001/api/verify-payment'
        const { data: order } = await axios.post(orderUrl, {
          amount: props.amount, // Amount in smallest currency unit (i.e., paise)
          currency: 'INR',
          receipt: 'receipt#1',
        });
        const options = {
          key: 'rzp_test_3jPROWrRVEjA4T',
          amount: order.amount,
          id:order.id,
          currency: order.currency,
          name: 'Your Company',
          description: 'Test Transaction',
          order_id: order.order_id,
          handler: async (response) => {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            const verificationResponse = await axios.post(paymentVerificationUrl, verificationData);
            if (verificationResponse.data.status === 'success') {
              alert('Payment successful!');

            } else {
              alert('Payment verification failed!');
            }
            navigationHandler('/')
          },
          prefill: {
            name: 'Anand raj',
            email: 'anandraj7008@gmail.com',
            contact: '6203253537',
          },
          notes: {
            address: 'Corporate Office',
          },
          theme: {
            color: '#F37254',
          },
        };
        const rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
  rzp1.open();
};
  return (
    <div>
      <button type="button" className="btn-success" onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;