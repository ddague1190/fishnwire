import axios from "axios";
import {
  CART_ADD_PREFLIGHT,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

export const addToCart = (addedItem) => async (dispatch, getState) => {

  dispatch({
    type: CART_ADD_PREFLIGHT
  })
  dispatch({
    type: CART_ADD_ITEM,
    payload: addedItem,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart =
  (productId, variantId) => async (dispatch, getState) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: {
        productId,
        variantId,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });
};
