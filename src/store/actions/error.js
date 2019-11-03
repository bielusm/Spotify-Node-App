export const resetErrorMsg = () => ({
  type: "RESET_ERROR_MESSAGE"
});

export const setErrorMsg = error => ({
  type: "SET_ERROR",
  error
});
