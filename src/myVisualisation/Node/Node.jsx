import React, { Component } from "react";
import "./Node.css";
export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // status: calcState(this.props),
    };
  }
  render() {
    const { row, col, id, isStart, isFinish } = this.props;
    let status = isStart ? "Start" : isFinish ? "Finish" : "Unused";
    return <div id={`node-${id}`} className={`node ${status}`}></div>;
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
