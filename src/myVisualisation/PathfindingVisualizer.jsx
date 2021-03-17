import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import logo from "./../logo.svg";
import elena from "./media/Elena.png";
import ari from "./media/Ari.png";
import fabio from "./media/Fabio.png";
import jan from "./media/Janniboy.png";
import jerome from "./media/Jerome.png";
import lilli from "./media/Lilli.png";
import marlen from "./media/Marlen.png";
import martin from "./media/Martin.png";
import max from "./media/Max.png";
import paul from "./media/Paul.png";

import { dijkstras, getNodesInShortestPathOrder } from "./algorithms/dijkstras";
import { nanoid } from "nanoid";
export const NUMBER_ROWS = 60;
export const NUMBER_COLLUMS = 25;
export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false, //run algo was started, resets with reset
      isRunning: false, //algo is running, resets after finish
      mouseDown: false,
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
      }, 10 * i);
      //start printing shortest path
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => this.animateShortestPath(nodesInShortestPath), 10 * i);
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

  mouseClickHandler(row, col) {
    if (!this.state.isStarted) {
      let newGrid = gridToggleWall(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseDown: true });
    }
  }
  mouseDownHandler(row, col) {
    if (!this.state.isStarted) {
      let newGrid = gridToggleWall(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseDown: true });
    }
  }
  mouseEnterHandler(row, col) {
    if (!this.state.isStarted) {
      if (this.state.mouseDown) {
        let newGrid = gridToggleWall(this.state.grid, row, col);
        this.setState({ grid: newGrid });
      }
    }
  }
  mouseUpHandler(row, col) {
    console.log("mouseUpHandler");
    this.setState({ mouseDown: false });
  }
  resetGridHandler() {
    this.resetGrid(this.state.grid);
    this.setState((prevState) => ({
      isStarted: false,
      // grid: newGrid,
    }));
  }
  //think about passing in grid and rendering it again
  resetGrid(grid) {
    grid.forEach((curRow) =>
      curRow.forEach((curNode) => {
        if (!curNode.isStart && !curNode.isFinish && !curNode.isWall) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Unused";
          curNode.isWall = false;
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else {
          curNode.isVisited = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        }
      })
    );
    return grid;
  }
  resetWallsHandler() {
    this.resetWalls(this.state.grid);
    this.setState((prevState) => ({
      isStarted: false,
    }));
  }
  resetWalls(grid) {
    grid.forEach((curRow) =>
      curRow.forEach((curNode) => {
        if (!curNode.isStart && !curNode.isFinish) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Unused";
          curNode.isWall = false;
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else {
          curNode.isVisited = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        }
      })
    );
    return grid;
  }
  //think about passing in grid and rendering it again
  // resetWalls(grid) {
  //   grid.forEach((curRow) =>
  //     curRow.forEach((curNode) => {
  //       if (!curNode.isStart && !curNode.isFinish && curNode.isWall) {
  //         document.getElementById(`node-${curNode.id}`).className =
  //           "node Unused";
  //         curNode.isWall = false;
  //         curNode.isVisited = false;
  //         curNode.isShortest = false;
  //         curNode.distance = Infinity;
  //         curNode.predecessor = null;
  //       }
  //     })
  //   );
  //   return grid;
  // }

  render() {
    const { grid } = this.state;
    console.log(this.state.mouseDown);
    return (
      <div>
        <header className="PVHeader">
          <h1>Pathfinding Visualiser</h1>
          <div className="ButtonBar">
            <button
              disabled={this.state.isStarted}
              onClick={() => this.startHandler()}
            >
              Run Dijkstras Algorithm
            </button>
            <button
              disabled={this.state.isRunning}
              onClick={() => this.resetGridHandler()}
            >
              Reset Grid
            </button>
            <button
              disabled={this.state.isRunning}
              onClick={() => this.resetWallsHandler()}
            >
              Reset Walls
            </button>
          </div>
        </header>
        <main>
          <div
            className="NodeGrid"
            onMouseLeave={(row, col) => this.mouseUpHandler(row, col)}
          >
            {grid.map((row, rowIdx) => {
              return (
                <div key={`row${rowIdx}`}>
                  {row.map((node, colIdx) => (
                    <Node
                      key={`r${rowIdx}c${colIdx}`}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      isWall={node.isWall}
                      isVisited={node.isVisited}
                      isShortest={node.isShortest}
                      id={node.id}
                      row={node.row}
                      col={node.col}
                      onMouseDown={(row, col) =>
                        this.mouseDownHandler(row, col)
                      }
                      onMouseEnter={(row, col) =>
                        this.mouseEnterHandler(row, col)
                      }
                      onMouseUp={(row, col) => this.mouseUpHandler(row, col)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="Logo-Container">
            <img src={elena} className="App-logo-1" alt="logo " />
            <img src={ari} className="App-logo-3" alt="logo " />
            <img src={fabio} className="App-logo-2" alt="logo " />
            <img src={jan} className="App-logo-3" alt="logo " />
            <img src={jerome} className="App-logo-1" alt="logo " />
            <img src={lilli} className="App-logo-2" alt="logo " />
            <img src={marlen} className="App-logo-3" alt="logo " />
            <img src={martin} className="App-logo-1" alt="logo " />
            <img src={max} className="App-logo-3" alt="logo " />
            <img src={paul} className="App-logo-2" alt="logo " />
          </div>
        </main>
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
    this.isShortest = false;
    this.id = nanoid(); //to directly identify nodes
    this.isWall = false;
  }
}

function gridToggleWall(grid, row, col) {
  let curNode = grid[row][col];
  if (!curNode.isStart && !curNode.isFinish) {
    curNode.isWall = !curNode.isWall;
  }

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
