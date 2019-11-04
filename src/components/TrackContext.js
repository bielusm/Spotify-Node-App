import React from "react";

export const TrackContext = props => (
  <>
    {props.trackContext && (
      <h2 className="current-track">{props.trackContext}</h2>
    )}
  </>
);

export default TrackContext;
