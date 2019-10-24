import React from "react";

const TrackContext = props => (
  <div>
    {props.trackContext && (
      <h2 className="current-track">{props.trackContext}</h2>
    )}
  </div>
);

export default TrackContext;
