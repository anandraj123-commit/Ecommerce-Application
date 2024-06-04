import { useContext } from 'react';
import CartContext from '../store/cart-context';
import Payment from '../component/Payment';
const CheckoutPage = () => {
  const ctx = useContext(CartContext);
  const amount = ctx.cart.reduce((total,product)=>{
    return total + +product.price;
  },0)
 

  return (
    <div className="row">
            <div className="col-8">
            <h1>Checkout</h1>
            <Payment amount={amount}></Payment>
    </div>
    </div>
  );
};

export default CheckoutPage;