export const responsiveReducer = (state = "", action) => {
  switch (action.type) {
    case "UPDATE_VIEWPORT_DIMENSIONS":
      return action.payload;

    default:
      return state;
  }
};
