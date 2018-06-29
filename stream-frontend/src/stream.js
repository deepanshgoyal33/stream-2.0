import React from 'react';
import ReactPlayer from 'react-player';
import { streamSocket } from './webSocket.js';

const URL = "http://www.youtube.com/watch?v=";

export default class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      play: false,
      mute: false,
      duration: 0,
      seek: 0,
    };
  }

  componentDidMount() {
    streamSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      this.setState({
        url: data['url'],
        play: data['play'],
        mute: data['mute'],
        duration: data['duration'],
      });
      if (data['seek'] !== this.state.seek) {
        this.player.seekTo(data['seek']);
      }
    }
    console.log("mount from stream.js");
  }
 
  handlePlay = () => {
    this.setState({
      play: true,
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.state.duration,
          seek: this.state.seek,
        };
        streamSocket.send(JSON.stringify(data));
      });
    console.log("handlePlay");
  }

  handlePause = () => {
    this.setState({
      play: false,
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.state.duration,
          seek: this.state.seek,
        };
        streamSocket.send(JSON.stringify(data));
      });
    console.log("handlePause");
  }

  handleDuration = (duration) => {
    this.setState({
      duration: duration,
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.state.duration,
          seek: this.state.seek,
        };
        streamSocket.send(JSON.stringify(data));
       });
    console.log("handleDuration");
  }

  handleProgress = (data) => {
    this.setState({
      seek: data['playedSeconds'],
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.state.duration,
          seek: this.state.seek,
        };
        streamSocket.send(JSON.stringify(data));
       });
    console.log("handleProgress");
  }

  ref = (player) => {
    this.player = player;
  }  
  
  render() {
    return(
    <ReactPlayer
      ref={this.ref}
      url={URL+this.state.url}
      playing={this.state.play}
      onPlay={this.handlePlay}
      onPause={this.handlePause}
      muted={this.state.mute}
      onDuration={this.handleDuration}
      onProgress={this.handleProgress}
    />
    );
  }
}
