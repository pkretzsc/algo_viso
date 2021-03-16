import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import logo from "./../logo.svg";
import { dijkstras, getNodesInShortestPathOrder } from "./algorithms/dijkstras";
import { nanoid } from "nanoid";
export const NUMBER_ROWS = 40;
export const NUMBER_COLLUMS = 20;
export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false, //run algo was started, resets with reset
      isRunning: false, //algo is running, resets after finish
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

  runDijkstras() {
    const {
      grid,
      start: { row: startRow, col: startCol },
      finish: { row: finishRow, col: finishCol },
    } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = dijkstras(grid, startNode, finishNode);
    const nodesInShortestPath = getNodesInShortestPathOrder(finishNode);
    this.animateAlgo(visitedNodesInOrder, nodesInShortestPath);
  }

  animateAlgo(visitedNodesInOrder, nodesInShortestPath) {
    console.log("start animation");
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const curNode = visitedNodesInOrder[i];
      setTimeout(() => {
        document.getElementById(`node-${curNode.id}`).className =
          "node Visited";
      }, 3 * i);
      //start printing shortest path
      if (i === visitedNodesInOrder.length - 1) {
        // console.log("start shortest path");
        setTimeout(() => this.animateShortestPath(nodesInShortestPath), 3 * i);
      }
    }
  }

  animateShortestPath(nodesInShortestPath) {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      const curNode = nodesInShortestPath[i];
      setTimeout(() => {
        //animate in shortest path in line
        document.getElementById(`node-${curNode.id}`).className =
          "node Shortest";
        if (i === nodesInShortestPath.length - 1) {
          this.setState({ isRunning: false });
        }
      }, 20 * i);
    }
  }

  startHandler() {
    this.runDijkstras();
    this.setState((prevState) => ({
      isStarted: true,
      isRunning: true,
    }));
  }

  //TODO prevent early reset and keep start and finish
  resetHandler() {
    this.resetGrid();
    this.setState((prevState) => ({
      isStarted: false,
    }));
  }
  mouseDownHandler(row, col) {
    console.log("mouseDown");
    let newGrid = gridToggleWall(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }
  resetGrid() {
    this.state.grid.forEach((curRow) =>
      curRow.forEach((curNode) => {
        if (!curNode.isStart && !curNode.isFinish) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Unused";
          curNode.isWall = false;
          curNode.isVisited = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else {
          curNode.isVisited = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        }
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
            <button
              disabled={this.state.isStarted}
              onClick={() => this.startHandler()}
            >
              Run Dijkstras Algorithm
            </button>
            <button
              disabled={this.state.isRunning}
              onClick={() => this.resetHandler()}
            >
              Reset Grid
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
                      isWall={node.isWall}
                      id={node.id}
                      row={node.row}
                      col={node.col}
                      onMouseDown={(row, col) =>
                        this.mouseDownHandler(row, col)
                      }
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
    this.isWall = false;
  }
}

function gridToggleWall(grid, row, col) {
  grid[row][col].isWall = true;
  return grid;
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
