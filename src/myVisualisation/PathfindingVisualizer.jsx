import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import logo from "./../logo.svg";
import { djikstras, getNodesInShortestPathOrder } from "./algorithms/dijkstras";
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
      startRow = start.row,
      startCol = start.col,
      finishRow = finish.row,
      finishCol = finish.Col,
    } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = djikstras(grid, startNode, finishNode);
    const nodesInShortestPath = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstras(visitedNodesInOrder, nodesInShortestPath);
  }
  animateDijkstras(visitedNodesInOrder, nodesInShortestPath) {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => this.animateShortestPath(nodesInShortestPath), i * 10);
      }
    }
  }
  animateShortestPath(nodesInShortestPath) {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const { row, col } = nodesInShortestPath[i];
        document.getElementById;
      });
    }
  }
  render() {
    const { grid } = this.state;
    return (
      <div>
        <header className="PVHeader">
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={() => this.runDijkstras()}>
            Run Dijkstras Algorithm
          </button>
          <div className="NodeGrid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={`row${rowIdx}`}>
                  {row.map((col, colIdx) => (
                    <Node
                      key={`r${rowIdx}c${colIdx}`}
                      isStart={col.isStart}
                      isFinish={col.isFinish}
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
    this.isVisited = flase;
    this.id = nanoid();
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
