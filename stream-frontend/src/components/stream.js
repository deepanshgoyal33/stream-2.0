import React from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import '../styles/stream.css';
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
      volume: 100,
      user: "",
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
        volume: data['volume'],
      });
      if (data['seek'] !== this.state.seek) {
        this.player.seekTo(data['seek']);
      }
    }
    console.log("mount from stream.js");
    const obj = localStorage.getItem('persist:polls');
    const id = JSON.parse(JSON.parse(obj).auth).access.user_id;
    axios({
      method: 'get',
      url: '/stream/users/' + id + '/',
      responseType: 'stream'
    })
      .then((response) => {
        this.setState({
          user: response.data.username,
        });
      });
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
          volume: this.state.volume,
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
          volume: this.state.volume,
        };
        streamSocket.send(JSON.stringify(data));
      });
    console.log("handlePause");
  }

  handleDuration = (duration) => {
    //let duration = this.player.getDuration();
    this.setState({
      duration: duration,
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.state.duration,
          seek: this.state.seek,
          volume: this.state.volume,
        };
        streamSocket.send(JSON.stringify(data));
       });
    console.log("handleDuration");
    console.log(this.state.duration);
  }

  handleProgress = (data) => {
    this.setState({
      seek: data['playedSeconds'],
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.player.getDuration(),
          seek: this.state.seek,
          volume: this.state.volume,
        };
        streamSocket.send(JSON.stringify(data));
       });
    console.log("handleProgress");
    console.log(this.state.play);
  }

  handleEnd = () => {
    this.setState({
      play: false,
      seek: 0,
      duration: 0,
    }, () => {
        let data = {
          play: this.state.play,
          url: this.state.url,
          mute: this.state.mute,
          duration: this.player.getDuration(),
          seek: this.state.seek,
          volume: this.state.volume,
        };
        streamSocket.send(JSON.stringify(data));
       });

  }

  ref = (player) => {
    this.player = player;
  }  
  
  render() {
    return(
    <div className="player-container">
    <iframe src={"https://www.youtube.com/embed/"+this.state.url+"?controls=0&disablekb=1&autoplay=0"} frameborder="0" allow="autoplay; encrypted-media" className="bg-video" allowfullscreen></iframe>
    <ReactPlayer
      ref={this.ref}
      url={URL+this.state.url}
      playing={this.state.play}
      onPlay={this.handlePlay}
      onPause={this.handlePause}
      muted={this.state.mute}
      volume={this.state.volume/100}
      onDuration={this.handleDuration}
      onProgress={this.handleProgress}
      onEnded={this.handleEnd}
      height="36vw"
      width="64vw"
    />
    <h4>{this.state.url ? "Played By: " + this.state.user : ""}</h4>
    </div>
    );
  }
}
