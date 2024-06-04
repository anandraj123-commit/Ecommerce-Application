import React,{useState} from 'react';
import classes from './Header.module.css';
import CartContext from '../store/cart-context';
import HoverModal from '../ui/HoverModal';

const Header = () => {
    const [modalVisibility,setModalVisibility] = useState(false);

    const modalHandlerFn=()=>{
        setModalVisibility(prev=>{
            return !prev;
        })
    }
    return (
        <CartContext.Consumer>
            {(ctx)=>{
                return  (
                <>
                <header className={classes['header']}>
                <div className={classes['logo']}>ShopLogo</div>
                <nav className={classes['nav']}>
                    <a href="/">Home</a>
                    <a href="/products">Products</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>
                <div className={classes['header-right']}>
                    <input type="text" placeholder="Search..." className={classes['search-bar']} />
                    <a href="/cart" className={classes['cart-icon']} onMouseEnter={modalHandlerFn}>  Cart ({ctx.cart.length})</a>
                    <a href="/login" className={classes['login-icon']}>Login</a>
                </div>
            </header>
            {modalVisibility && <HoverModal cart = {ctx.cart}></HoverModal>}
                </>)
            }}
        </CartContext.Consumer>
       
    );
};

export default Header;
