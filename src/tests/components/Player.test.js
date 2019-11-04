import React from "react";
import { shallow } from "enzyme";
import { Player } from "../../components/Player";
// bearerToken={this.bearerToken}
// is_playing={this.is_playing}
// likes_song={this.likesSong}
// id={this.currentTrack.id}
// update={this.update}

let bearerToken, is_playing, likes_song, id, update, wrapper;

beforeEach(() => {
  bearerToken = "12345";
  is_playing = false;
  likes_song = false;
  id = "12345";
  update = jest.fn();
  const wrapper = shallow(
    <Player
      bearerToken={bearerToken}
      is_playing={is_playing}
      likes_song={likes_song}
      id={id}
      update={update}
    />
  );
});

test("Player component with default values", () => {
  expect(wrapper).toMatchSnapshot();
});
