import React, { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Challan1.css';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from "../config";

const Challan = () => {
  const { currentUser } = useContext(AuthContext);
  const { id: orderId } = useParams();

  const sendEmail = async () => {
    try {
      // You can use an API endpoint to send the email here
      // You may need to include orderId or other data in the request
      const response = await axios.post(`${API_BASE_URL}/send-email/${orderId}`, );
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    }
  };

  useEffect(() => {
    sendEmail();
  }, [])

  return (
    <div className='Heading'>
      <p>SIGNATURE HAS BEEN TAKEN</p>
      <div className='button-container1'>
        <Link to={`/orders/${currentUser}`}>
          <button className='centered-button1 button1'>Back to Orders</button>
        </Link>
      </div>
    </div>
  );
};

export default Challan;
