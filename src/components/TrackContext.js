import React from "react";
import Typography from "@material-ui/core/Typography";

export const TrackContext = props => (
  <>
    {props.trackContext && (
      <Typography component="h3" variant="h5">
        {props.trackContext}
      </Typography>
    )}
  </>
);

export default TrackContext;
