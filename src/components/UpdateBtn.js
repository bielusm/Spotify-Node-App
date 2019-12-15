import React from "react";
import Button from "@material-ui/core/Button";

export const UpdateBtn = props => (
  <Button
    id="updateBtn"
    variant="contained"
    color="primary"
    onClick={props.update}
  >
    Update
  </Button>
);

export default UpdateBtn;
