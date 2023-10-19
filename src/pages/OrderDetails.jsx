import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./OrderDetail.css"
import { AuthContext } from '../context/AuthContext';
import Logout from './Logout';
import API_BASE_URL from "../config";


const OrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const handleOrderClick = () => {
      axios
        .get(`${API_BASE_URL}/orders/${currentUser}`)
        .then((response) => {
          setSelectedOrder(response.data);
          console.log(response.data)
          
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });

    };
    
    handleOrderClick(currentUser)
  }, [currentUser])


  return (
    <div className='Details'>
      <h2 className='header'>
        <Logout />
        <strong>ORDERS</strong>
      </h2>
      <section>
        {(selectedOrder.length === 0) ?  (
          <div>
            NO ORDERS AVAILABLE
          </div>
        ) : 
        ( <div className='cards'>
          {selectedOrder.map(({ creditor_name, creditor_number_1, creditor_address_1, creditor_address_2,
            creditor_address_3, creditor_pincode, creditor_state, order_number, id }, index) => (
            <Link to={`/orderdetail/${id}`}>
              <div key={index}>
                <div className="card">
                  <div className="card-header">
                    <div >
                      <h2 className='info'> <strong>
                        <div className="flex-item">
                        Customer Information
                        </div>
                        {/* <span className="flex-item"> <AiFillEye />
                        </span> */}
                      </strong> </h2>
                    </div>
                    <div className="card-body">
                      <p>
                        Name: {creditor_name}
                      </p>
                      <p>
                        Phone Number: {creditor_number_1}
                      </p>
                      <p>
                        Address: {creditor_address_1 + ", " + creditor_address_2 + ", " + creditor_address_3 + ", " + creditor_state + ", " + creditor_pincode}
                      </p>
                    </div>
                    <div className="order-info">
                      <h3> <strong>
                        Order Information
                      </strong>
                      </h3>
                      <p>
                        Order Number: {order_number}
                      </p>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div> )}
      </section>
    </div>
  );
};

export default OrderDetails;