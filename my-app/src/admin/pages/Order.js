
import { useState, useEffect} from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import '../asset/public.css';

const Courses = () => {
    const [orders, setOrder] = useState([]);

    const apiUrl = process.env.REACT_APP_API_URL;

    //http://localhost:5001/api/orders
    useEffect(() => {
        axios.get(`${apiUrl}/api/orders`)
            .then(response => setOrder(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    
    return (
        <div class="order-page">
            <div class="order-page_lists">
                <h1>Order Page</h1>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Amount</th>
                        <th>amount_due</th>
                        <th>currency</th>
                        <th>offer_id</th>
                        <th>created_at</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => {
                        return (<tr key={index}>
                            <td>{index + 1}</td>
                            <td>{order.amount}</td>
                            <td>{order.amount_due}</td>
                            <td>{order.currency}</td>
                            <td>{order.offer_id}</td>
                            <td>{order.created_at}</td>
                            <td>{order.status}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>

    )

}
export default Courses;