import React, { Component } from "react";
import "./Node.css";
import elena from "./../media/Elena.png";
export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // status: calcState(this.props  ),
    };
  }
  render() {
    const {
      row,
      col,
      id,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isVisited,
      isShortest,
    } = this.props;
    let status = isStart
      ? "Start"
      : isFinish
      ? "Finish"
      : isWall
      ? "Wall"
      : "Unused";

    return (
      <div className="NodeBorder">
        <div
          id={`node-${id}`}
          className={`node ${status}`}
          ondragstart="return false;"
          ondrop="return false;"
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp(row, col)}
        ></div>
      </div>
    );
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
