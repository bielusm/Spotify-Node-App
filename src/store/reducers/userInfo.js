export default (state = { access_token: null }, action) => {
  switch (action.type) {
    case "SET_ACCESS_TOKEN":
      return { ...state, access_token: action.access_token };
  }
  return state;
};
