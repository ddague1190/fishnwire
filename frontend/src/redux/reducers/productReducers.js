// Reducer is a function that takes in current state and an action - what we want to do with our current state, it will manipulate our state and then return a new state into the store
import {
  CATEGORIES_REQUEST,
  CATEGORIES_FAIL,
  CATEGORIES_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  UPDATE_COMMENTS
} from "../constants/productConstants";

export const categoriesReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CATEGORIES_REQUEST:
      return { loading: true };
    case CATEGORIES_SUCCESS:
      return { categories: action.payload, loading: false };
    case CATEGORIES_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };

    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages
      };

    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: { reviews: [], variants: [], images: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, product: {} };

    case PRODUCT_DETAILS_SUCCESS:
      let product = action.payload;
      const imageList = product.images.map((image, index) => {
        return image.image;
      });
      product = { ...product, images: imageList };

      return { loading: false, product: product };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_COMMENTS:
      return { loading: false, product: {...product, comments: action.payload }}
    default:
      return state;
  }
};

