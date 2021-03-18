import React, { Component } from "react";
import "./Node.css";

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
      onMouseLeave,
      noFinishFound,
    } = this.props;
    let status = isStart
      ? `Start ${noFinishFound ? "NoFinishS" : ""}`
      : isFinish
      ? `Finish ${noFinishFound ? "NoFinishF" : ""}`
      : isWall
      ? "Wall"
      : "Unused";

    return (
      <div className="NodeBorder">
        <div
          id={`node-${id}`}
          className={`node ${status}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseLeave={() => onMouseLeave(row, col)}
        ></div>
      </div>
    );
  }
}
