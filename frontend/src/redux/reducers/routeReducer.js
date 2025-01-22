export const routeReducer = (state = "", action) => {
  switch (action.type) {
    case "UPDATE_KEYWORD":
      return action.payload;

    case "RESET_KEYWORD":
      return "";

    default:
      return state;
  }
};
