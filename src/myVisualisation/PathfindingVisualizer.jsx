import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import logo from "./../logo.svg";
import { runDijkstras } from "./algorithms/dijkstras";
import { nanoid } from "nanoid";
export const NUMBER_ROWS = 40;
export const NUMBER_COLLUMS = 20;
export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false,
      grid: [],
      start: {
        row: 4,
        col: 4,
      },
      finish: {
        row: 34,
        col: 14,
      },
    };
  }
  componentDidMount() {
    this.setState({ grid: createGrid(this.state) });
  }
  startHandler() {
    if (!this.state.isStarted) {
      runDijkstras(this.state);
    } else {
      //reset grid
      this.resetGrid();
    }
    this.setState((prevState) => ({
      isStarted: !prevState.isStarted,
    }));
  }
  resetGrid() {
    this.state.grid.forEach((curRow) =>
      curRow.forEach((curNode) => {
        document.getElementById(`node-${curNode.id}`).className = "node Unused";
        curNode.isVisited = false;
        curNode.distance = Infinity;
        curNode.predecessor = null;
      })
    );
  }

  render() {
    const { grid } = this.state;
    return (
      <div>
        <header className="PVHeader">
          <img src={logo} className="App-logo" alt="logo " />
          <div className="ButtonBar">
            <button onClick={() => this.startHandler()}>
              {this.state.isStarted ? "Reset Grid" : "Run Dijkstras Algorithm"}
            </button>
            <button onClick={() => this.ResetHandler()}>
              {this.state.isStarted ? "Reset Grid" : "Run Dijkstras Algorithm"}
            </button>
          </div>

          <div className="NodeGrid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={`row${rowIdx}`}>
                  {row.map((node, colIdx) => (
                    <Node
                      key={`r${rowIdx}c${colIdx}`}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      id={node.id}
                      row={node.row}
                      col={node.col}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </header>
      </div>
    );
  }
}

//Node class
class NodeCl {
  constructor(row, col, parentState) {
    this.row = row;
    this.col = col;
    this.isStart =
      row === parentState.start.row && col === parentState.start.col;
    this.isFinish =
      row === parentState.finish.row && col === parentState.finish.col;
    this.distance = Infinity;
    this.predecessor = null;
    this.isVisited = false;
    this.id = nanoid(); //to directly identify nodes
  }
}

//create initial grid
function createGrid(state) {
  const grid = [];
  for (let row = 0; row < NUMBER_ROWS; row++) {
    const curRow = [];
    for (let col = 0; col < NUMBER_COLLUMS; col++) {
      const curNode = new NodeCl(row, col, state);
      curRow.push(curNode);
    }
    grid.push(curRow);
  }
  return grid;
}
