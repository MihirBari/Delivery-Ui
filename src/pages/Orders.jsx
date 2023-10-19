import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import "./orders.css"
import { Link, useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from "../config";

const Orders = () => {
    const [orders, setOrders] = useState([])
    const { id } = useParams()
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orderdetail/${id}`);
                setOrders(response.data);
                console.log(response.data)
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders(id)
    }, [id]);

    const columns = [
        {
            name: 'Sr. No',
            selector: (_, index) => index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'HSN Code',
            selector: row => row.HSNCODE,
            sortable: true,
        },
        {
            name: 'Product Name',
            selector: row => row.productName,
            sortable: true,
        },
        {
            name: 'Order Items',
            selector: row => row.Items,
            sortable: true,
        },
        {
            name: 'UOM',
            selector: row => row.Test,
            sortable: true,
        },
        {
            name: 'CAT#',
            selector: row => row.Cat,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.orderQuantity,
            sortable: true,
        },
    ];

    return (
        <div className='order'>
            <h3 className='header'>
                <strong>ORDER DETAILS</strong>
            </h3>

            <DataTable
                className='dataTable'
                columns={columns}
                data={orders}
                fixedHeader
                fixedHeaderScrollHeight='450px'
                highlightOnHover
                striped
                pagination
            />

            <div className='button-container'>
                <Link to={`/orders/${currentUser}`}>
                    <div >
                        <button className=' button' >Back</button>
                    </div>
                </Link>
                <Link to={`/signature/${id}`}>
                    <div >
                        <button className=' button' >Next</button>
                    </div>
                </Link>
            </div>


        </div>
    )
};


export default Orders;