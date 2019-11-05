//taken from https://github.com/reactjs/redux/blob/master/examples/real-world/src/reducers/index.js#L16-L27
//for more info see https://stackoverflow.com/questions/34403269/what-is-the-best-way-to-deal-with-a-fetch-error-in-react-redux

/**
 * Sets the error state to one provided, if type is RESET_ERROR_MESSAGE
 * the message will revert to null
 */
export default (state = null, action) => {
  const { type, error } = action;
  if (type === "RESET_ERROR_MESSAGE") return null;
  else if (error) return error;
  else return state;
};
