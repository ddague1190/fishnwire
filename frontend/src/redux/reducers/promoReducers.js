export const fishFactReducer = (state = { fish: {} }, action) => {
  switch (action.type) {
    case "FISH_FACT_REQUEST":
      return { ...state, loading: true, fish: {} };

    case "FISH_FACT_SUCCESS":
      return {
        loading: false,
        fish: action.payload,
      };

    case "FISH_FACT_FAIL":
      return { loading: false, fish: {}, error: true };

    default:
      return state;
  }
};
