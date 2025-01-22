import axios from "axios";
import {
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
  CATEGORIES_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

import axiosInstance from "../axiosInstance";
import { resetKeyword } from "./routeActions";

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORIES_REQUEST });
    const { data } = await axios.get("/api/categories/");
    dispatch({
      type: CATEGORIES_SUCCESS,
      payload: data,
    });
  } catch {
    dispatch({
      type: CATEGORIES_FAIL,
      payload: "Failed to load products",
    });
  }
};

export const listProducts =
  (keyword = "") =>
    async (dispatch) => {
      try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await axios.get(`/api/products/${keyword}`);

        dispatch({
          type: PRODUCT_LIST_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PRODUCT_LIST_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
        });
      }
    };

export const listCategorizedProducts =
  (category, subcategory = "", keyword = "") =>
    async (dispatch) => {
      try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await axios.get(
          `/api/products/${category}/${subcategory}${subcategory && "/"
          }${keyword}`
        );

        dispatch(resetKeyword());

        dispatch({
          type: PRODUCT_LIST_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PRODUCT_LIST_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
        });
      }
    };

export const listProductsByBrand =
  (brand, search = "") =>
    async (dispatch) => {
      try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await axios.get(`/api/brands/${brand}/${search}`);

        dispatch(resetKeyword());

        dispatch({
          type: PRODUCT_LIST_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PRODUCT_LIST_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
        });
      }
    };

export const listProductDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${slug}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

