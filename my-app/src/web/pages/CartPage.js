import CartContext from '../store/cart-context';
import Card from '../ui/Card';
import { useNavigate } from 'react-router-dom';

const CartPage = (props) => {
  const navigate = useNavigate();
  const navigationHandler = () => {
    navigate("/checkout");
  };
  return (
    <CartContext.Consumer>
      {(ctx)=>{
        return (
          <div className="row">
            <div className="col-8">
            <h1>Shopping Cart</h1>
          {ctx.cart.map(product=>{
            return (
                   <Card key={product.id}> 
                      <div className="product">
                          <div className="product-details">
                          <img alt = {product.name} src={product.image} width="80px" height="50px"></img>
                           <span>{product.name}</span><br/>
                           <span>Rs {product.price}</span >
                           <div className="product-description">{product.description}</div>
                    </div>
                    <button type="button" class="btn-danger" onClick={()=>props.removeItemFromCart(product.id)}>Remove</button>
                 </div>
              </Card>
            )})}
            </div>
            <div className="col-4" style={{ margin: "56px 0 0 0"}}>
              <Card>
                <div className="cart-total">
                <h2>Total:{ctx.cart.reduce((total,product)=>{
                return total + +product.price;
              },0)}
              </h2>
              <button type="button" class="btn-primary" onClick ={navigationHandler}>checkout</button>
                </div>
              </Card>
            </div>
            </div>
        )
      }
    }
    </CartContext.Consumer>
  );
};

export default CartPage;