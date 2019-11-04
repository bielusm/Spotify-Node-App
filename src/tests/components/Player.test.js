import React from "react";
import { shallow } from "enzyme";
import { Player } from "../../components/Player";
import * as PlayerApi from "../../api/player";

let bearerToken, is_playing, likes_song, id, update, wrapper;

beforeAll(() => {
  PlayerApi.prevTrack = jest.fn().mockResolvedValue();
  PlayerApi.pausePlayer = jest.fn().mockResolvedValue();
  PlayerApi.startPlayer = jest.fn().mockResolvedValue();
  PlayerApi.nextTrack = jest.fn().mockResolvedValue();
  PlayerApi.modifyLibrary = jest.fn().mockResolvedValue();
  update = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();

  bearerToken = "12345";
  is_playing = false;
  likes_song = false;
  id = "12345";

  wrapper = shallow(
    <Player
      bearerToken={bearerToken}
      is_playing={is_playing}
      likes_song={likes_song}
      id={id}
      update={update}
    />
  );
});

test("Test Player component with default values", () => {
  expect(wrapper).toMatchSnapshot();
});

test("Test Player component with set values", () => {
  wrapper.setProps({ is_playing: true, likes_song: true });
  expect(wrapper).toMatchSnapshot();
});

test("Test prev button", async () => {
  await wrapper.find(".prevBtn").simulate("click");
  expect(PlayerApi.prevTrack).toHaveBeenCalledWith(bearerToken);
  expect(update).toHaveBeenCalled();
});

test("Test next button", async () => {
  await wrapper.find(".nextBtn").simulate("click");
  expect(PlayerApi.nextTrack).toHaveBeenCalledWith(bearerToken);
  expect(update).toHaveBeenCalled();
});

test("Test play/pause button", async () => {
  const btn = wrapper.find(".playBtn");

  wrapper.setProps({ is_playing: false });
  await btn.simulate("click");
  expect(PlayerApi.startPlayer).toHaveBeenCalledWith(bearerToken);
  expect(update).toHaveBeenCalled();

  wrapper.setProps({ is_playing: true });
  await btn.simulate("click");
  expect(PlayerApi.pausePlayer).toHaveBeenCalledWith(bearerToken);
  expect(update).toHaveBeenCalled();
});

test("Test like button", async () => {
  const btn = wrapper.find(".likeBtn");

  await btn.simulate("click");
  expect(PlayerApi.modifyLibrary).toHaveBeenCalledWith(
    bearerToken,
    id,
    likes_song
  );
  expect(update).toHaveBeenCalled();
});
