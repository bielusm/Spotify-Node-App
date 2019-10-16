import React from "react";

const UpdateBtn = props => (
  <button
    id="updateBtn"
    className="btn btn-secondary"
    onClick={props.update}
    disabled={props.updateDisabled}
  >
    Update
  </button>
);

export default UpdateBtn;
