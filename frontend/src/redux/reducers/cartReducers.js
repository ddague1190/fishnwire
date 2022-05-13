import {
  CART_ADD_PREFLIGHT,
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_PREFLIGHT:
      return {...state, alreadyAdded: false}
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.productId === item.productId && x.variantId === item.variantId
      );

      if (existItem) {
        if(existItem.qty === 1 && item.qty === 1) return {...state, alreadyAdded: true}
        if(item.qty === 0) {
          return {
            ...state,
            cartItems: state.cartItems.filter(
              (x) => x.productId !== item.productId || x.variantId !== item.variantId
            ),
          };
        }
        else {
          return {
            ...state,
            cartItems: state.cartItems.map((x) =>
              x.productId === existItem.productId &&
              x.variantId === existItem.variantId
                ? item
                : x
            ),
          };
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      const pId = action.payload.productId;
      const vId = action.payload.variantId;
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) => x.productId !== pId || x.variantId !== vId
        ),
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case CART_CLEAR_ITEMS:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};
