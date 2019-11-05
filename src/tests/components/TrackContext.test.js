import React from "react";
import { shallow } from "enzyme";
import { TrackContext } from "../../components/TrackContext";

let trackContext, wrapper;
beforeEach(() => {
  trackContext = "This is a test track";
  wrapper = shallow(<TrackContext trackContext={trackContext} />);
});

test("CurrentTrack snapshot test", () => {
  expect(wrapper).toMatchSnapshot();
});

test("CurrentTrack snapshot test no track", () => {
  wrapper.setProps({ trackContext: null });
  expect(wrapper).toMatchSnapshot();
});
