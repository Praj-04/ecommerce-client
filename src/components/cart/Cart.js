import React from "react";
import "./Cart.scss";
import { AiOutlineClose } from "react-icons/ai";
import CartItem from "../cartItem/CartItem";
import { useSelector } from "react-redux";
import { BsCartX } from "react-icons/bs";
import {axiosClient} from '../../utils/axiosClient'

import {loadStripe} from '@stripe/stripe-js';




function Cart({ onClose }) {
  const cart = useSelector((state) => state.cartReducer.cart);
  let totalAmount = 0;
  cart.forEach((item) => (totalAmount += item.quantity * item.price));
  const isCartEmpty = cart.length === 0;

async function handleCheckout(){
try {
  const response = await axiosClient.post('/orders',{
    products : cart
  });

  const stripe = await loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

  const data = await stripe.redirectToCheckout({
    sessionId:response.data.stripeId
  })

  console.log('stripe data', data);
}
  
 catch (error) {
  console.log(error);
}
}

  


  return (
    <div className="Cart">
      <div className="overlay" onClick={onClose}></div>
      <div className="cart-content">
        <div className="header">
          <h4>Shopping Cart</h4>
          <div className="close-btn" onClick={onClose}>
            {" "}
            <AiOutlineClose /> Close
          </div>
        </div>

        <div className="cart-item">
          {cart.map((item) => (
            <CartItem key={item.key} cart={item} />
          ))}
        </div>
        {isCartEmpty && (
          <div className="empty-cart-info">
            <div className="icon">
              <BsCartX />
            </div>
            <h3>Cart is Empty</h3>
          </div>
        )}

        {!isCartEmpty && (
          <div className="checkout-info">
            <div className="total-amount">
              <h3 className="Total-message">Total</h3>
              <h3 className="Total-value">₹ {totalAmount} </h3>
            </div>
            <div className="checkout btn-primary" onClick={handleCheckout}>Checkout now</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
