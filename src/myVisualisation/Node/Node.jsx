import React, { Component } from "react";
import "./Node.css";
export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: calcState(this.props),
    };
  }
  render() {
    return <div className={`node ${this.state.status}`}></div>;
  }
}

function calcState(props) {
  if (props.isStart) {
    return "Start";
  } else if (props.isFinish) {
    return "Finish";
  } else {
    return "Unused";
  }
}
