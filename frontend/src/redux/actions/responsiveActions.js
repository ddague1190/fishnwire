export const updateViewportDimensions = (dimensions) => async (dispatch) => {
  dispatch({
    type: "UPDATE_VIEWPORT_DIMENSIONS",
    payload: dimensions,
  });
};
