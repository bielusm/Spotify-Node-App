import React from "react";

export const Loading = props => (
  <div>
    {props.loading && (
      <div className="loadingStatus">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
        <h2 className="mx-2 d-inline">Loading...</h2>
      </div>
    )}
  </div>
);

export default Loading;
