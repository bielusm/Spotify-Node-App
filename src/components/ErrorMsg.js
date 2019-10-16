import React from "react";

const ErrorMsg = props => (
  <div>
    {props.msg && (
      <h2 id="errMsg" className="my-4">
        {props.msg}
      </h2>
    )}
  </div>
);

export default ErrorMsg;
