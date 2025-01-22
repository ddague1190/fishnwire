export const updateKeyword = (keyword) => ({
  type: "UPDATE_KEYWORD",
  payload: keyword,
});

export const resetKeyword = () => ({
  type: "RESET_KEYWORD",
});
