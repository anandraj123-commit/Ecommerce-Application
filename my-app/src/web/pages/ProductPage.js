
import React, { useEffect, useState } from 'react';
import '../asset/public.css'
import axios from 'axios';

const ProductPage = (props) => {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/courses')
      .then(response => {
        console.log("response",response);
        setCourses(response.data)
  })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div className="product-page">
      <h1>Courses Available</h1>
      <div className="row">
      {courses.map(product => (
          <div className="col-4" key={product.id}>
            <img src={product.image} alt="Girl in a jacket" width="250" height="250"/>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price} INR</p>
            <button type="button" class="btn-success" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );

  function addToCart(product) {
    props.onAddItemToCart(product);
  }
};

export default ProductPage;