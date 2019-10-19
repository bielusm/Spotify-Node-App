import React from "react";

const TrackContext = props => (
  <div>
    {props.trackContext && <h2 id="currentTrack">{props.trackContext}</h2>}
  </div>
);

export default TrackContext;
