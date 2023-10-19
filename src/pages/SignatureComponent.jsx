import axios from 'axios';
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Link, useParams } from 'react-router-dom';
import "./SignatureComponent.css"
import API_BASE_URL from "../config";

import { toast } from 'react-toastify';

const SignatureComponent = () => {
  const signatureRef = useRef(null);
  const { id: orderId } = useParams();
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  const handleSave = async () => {
    const signatureDataURL = signatureRef.current.toDataURL();
    
    const TOAST_SUCCESS_SIGNATURE = "SIGNATURE IS TAKEN";
    const TOAST_SUCCESS_DELIVERED = "Delivered";
    const TOAST_ERROR_SIGNATURE_MISSING = "Please provide a signature before submitting.";

    try {
      if (!isSignatureEmpty) {
        await axiosInstance.put(`/orders/${orderId}`, { signature: signatureDataURL });
        toast.success(TOAST_SUCCESS_SIGNATURE);
        toast.success(TOAST_SUCCESS_DELIVERED);
      } else {
        toast.error(TOAST_ERROR_SIGNATURE_MISSING);
      }
    } catch (error) {
      console.error('Error during requests:', error);
      toast.error(error);
    }
  };

  const handleSignatureChange = () => {
    setIsSignatureEmpty(signatureRef.current.isEmpty());
  };

  return (
    <div className='signature'>
      <p>Take Signature Below</p>
      <SignatureCanvas
        ref={signatureRef}
        canvasProps={{
          width: 350,
          height: 200,
          style: { background: 'white', border: '1px solid #000' },
        }}
        onEnd={handleSignatureChange}
      />
      <br />
      <div className='button-contain1'>
      <Link to={`/orderdetail/${orderId}`}>
                    <div >
                        <button className=' button' >Back</button>
                    </div>
                </Link>
        <Link to={`/challan/${orderId}`}>
          <button
            className='centered-button button'
            onClick={handleSave}
            disabled={isSignatureEmpty}
          >
            SUBMIT
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignatureComponent;
