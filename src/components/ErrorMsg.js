import React from "react";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";

export const ErrorMsg = props => (
  <>
    {props.errMsg && (
      <Typography variant="h2" id="errMsg" className="my-4">
        {props.errMsg}
      </Typography>
    )}
  </>
);

const mapStateToProps = state => ({ errMsg: state.error });

export default connect(mapStateToProps)(ErrorMsg);
