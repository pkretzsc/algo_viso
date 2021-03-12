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
    // const { startRow: row, startCol = col } = this.state.start;
    // const { finishRow: row, finishCol = col } = this.state.finish;

    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = dijkstras(grid, startNode, finishNode);
    // console.log(visitedNodesInOrder);
    const nodesInShortestPath = getNodesInShortestPathOrder(finishNode);
    // console.log(nodesInShortestPath);
    this.animateDijkstras(visitedNodesInOrder, nodesInShortestPath);
  }
  animateDijkstras(visitedNodesInOrder, nodesInShortestPath) {
    console.log("start animation");
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      // console.log(i);
      const curNode = visitedNodesInOrder[i];
      setTimeout(() => {
        // const { row, col } = nodesInShortestPath[i];
        document.getElementById(`node-${curNode.id}`).className =
          "node Visited";
      }, 10 * i);
      if (i === visitedNodesInOrder.length - 1) {
        // console.log("start shortest pat h");
        setTimeout(() => this.animateShortestPath(nodesInShortestPath), 10 * i);
      }
    }
  }
  animateShortestPath(nodesInShortestPath) {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      const curNode = nodesInShortestPath[i];
      setTimeout(() => {
        // const { row, col } = nodesInShortestPath[i];
        document.getElementById(`node-${curNode.id}`).className =
          "node Shortest";
      }, 50 * i);
    }
  }
  render() {
    const { grid } = this.state;
    return (
      <div>
        <header className="PVHeader">
          <img src={logo} className="App-logo" alt="logo " />
          <button onClick={() => this.runDijkstras()}>
            Run Dijkstras Algorithm
          </button>
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
