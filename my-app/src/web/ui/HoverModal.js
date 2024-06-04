import Card from "./Card";
import React from "react";
import ReactDOM from "react-dom";



const ModalOverLay = (props) => {
    return (
      <Card>
       {props.cart.map(product=>{
        return (
            <Card key={product.id}>
                 <div className="product">
                    <div className="product-details">
                        <img alt = {product.name} src={product.image} width="80px" height="50px"></img>
                        <span>{product.name}</span><br/>
                        <span>Rs {product.price}</span >
                        <div className="product-description">{product.description}</div>
                    </div>
                 </div>
            </Card>
            
        )
       })}
           Total = Rs {props.cart.reduce((total,coures)=>{
            return total + +coures.price;
           },0)}
      <button type="button" class="button-primary"><a href="/cart">Go To Cart</a></button>
      </Card>
    );
  };

const HoverModal = (props)=> {
    return (
         ReactDOM.createPortal(
        <ModalOverLay cart = {props.cart}/>,
        document.getElementById("backdrop-root")
      ))

}


export default HoverModal;