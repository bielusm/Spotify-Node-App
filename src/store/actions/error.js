export const resetErrorMsg = () => ({
  type: "RESET_ERROR_MESSAGE"
});

//handles error msgs given from rejected promises
export const setErrorMsg = error => {
  console.log(error);
  let msg = error.message;
  if (!isNaN(msg)) {
    const status = parseInt(msg);
    switch (status) {
      case 401:
        msg = "Please login, sessions are only valid for one hour";
        //   this.setState(() => ({ loginVisible: true }));
        break;
      case 429:
        msg =
          "Error: too many requests to spotify api, please wait a little and try again";
        break;
      case 403:
        msg = "I'm not authorized to perform this action";
        break;
      default: {
        msg = status;
      }
    }
  }

  return { type: "SET_ERROR", error: msg };
};
