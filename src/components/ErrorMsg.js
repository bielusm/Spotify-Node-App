import React from "react";
import { connect } from "react-redux";

export const ErrorMsg = props => (
  <>
    {props.errMsg && (
      <h2 id="errMsg" className="my-4">
        {props.errMsg}
      </h2>
    )}
  </>
);

const mapStateToProps = state => ({ errMsg: state.error });

export default connect(mapStateToProps)(ErrorMsg);
