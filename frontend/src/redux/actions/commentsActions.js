// This is temporary comments section to utilize the react-comments package.
// Not satisfied with design of this package but it was good practice to quickly integrate and resolve conflicts
import axiosInstance from "../axiosInstance"
import { UPDATE_COMMENTS } from "../constants/productConstants";

export const addComment =
    (productId, comment) => async (dispatch, getState) => {
        try {
            const { data } = await axiosInstance.post(
                `/api/products/${productId}/comments`,
                comment
            );

        } catch (error) {
            console.log(error)
        }
    };

export const editComment =
    (id, text) => async (dispatch, getState) => {
        try {
            const { data } = await axiosInstance.put(
                `/api/users/${id}/editcomment/`,
                {text}
            );

        } catch (error) {
            console.error(error)
        }
    };

export const deleteComment =
    (id) => async (dispatch, getState) => {
        try {
            const { data } = await axiosInstance.delete(
                `/api/users/${id}/deletecomment/`,
            );

        } catch (error) {
            console.error(error)
        }
    };

