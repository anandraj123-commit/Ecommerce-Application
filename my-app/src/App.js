// src/App.js
import React,{useState,useEffect} from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductPage from './web/pages/ProductPage';
import OrderPage from './web/pages/OrderPage';
import CartPage from './web/pages/CartPage';
import Header from './web/component/Header';
import axios from 'axios';
 import CartContext from './web/store/cart-context';
import CheckoutPage from './web/pages/CheckoutPage';
import Admin from './admin/pages/Admin';
import Order from './admin/pages/Order';
import Courses from './admin/pages/Courses';


function App() {
  const [cart,setCart] = useState([]);
  const router = createBrowserRouter([
    { path: "/", element: <ProductPage onAddItemToCart = {onAddItemToCart}/> },
    { path: "/order", element: <OrderPage /> },
    { path: "/cart", element: <CartPage  removeItemFromCart={removeItemFromCart}/> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/admin", element: <Admin /> },
    { path: "/admin/courses", element: <Courses /> },
    { path: "/admin/order", element: <Order /> }
  ]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/cart')
      .then(response => {
        setCart(response.data);
      })
      .catch(error => console.error('Error fetching cart:', error));
  }, []);



  function onAddItemToCart(course){
    let productExist = cart.find(p=>{
      return p.course === course.id
    })

    if(!productExist){
      axios.post('http://localhost:5001/api/cart', course)
      .then(response => {
        setCart(prev=>{
          return [...prev,response.data]
        });
      }).catch(error => console.error('Error adding to cart:', error));
    }
  }

  function removeItemFromCart(id){
    let productExist = cart.find(p=>{
      return p.id === id
    })
    if(productExist){
      axios.delete(`http://localhost:5001/api/cart/${id}`)
      .then(response => {
        setCart(prev=>{
          return prev.filter(product=> {
            return product.id !== id
          })
        })
      }).catch(error => console.error('Error adding to cart:', error));
    }
    }
  

  
  return (
    <CartContext.Provider value={{cart:cart}}>
     <Header></Header> 
    <div className= "container">
    <RouterProvider router={router}/>
    </div>
    </CartContext.Provider>
  );
}

export default App;