import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5001/api/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);
  
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <p>Status: {order.status}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>{item.name} - {item.quantity}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;