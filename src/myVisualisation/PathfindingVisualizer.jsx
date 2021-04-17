import React, { Component } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import elena from "./media/Elena.png";
import ari from "./media/Ari.png";
import fabio from "./media/Fabio.png";
import jan from "./media/Janniboy.png";
import jerome from "./media/Jerome.png";
import lilli from "./media/Lilli.png";
import marlen from "./media/Marlen.png";
import martin from "./media/Martin.png";
import max from "./media/Max.png";
// import paul from "./media/Paul.png";

import { dijkstras, getNodesInShortestPathOrder } from "./algorithms/dijkstras";
import { nanoid } from "nanoid";
import { optionsAlgo, selectAlgoStyle } from "./data/select.js";
import Select from "react-select";
import { aStarLin } from "./algorithms/aStar";
export const NUMBER_ROWS = 60;
export const NUMBER_COLLUMS = 25;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: false, //run algo was started, resets with reset
      isRunning: false, //algo is running, resets after finish
      mouseDownOther: false,
      mouseDownStart: false,
      mouseDownFinish: false,
      grid: [],
      start: {
        row: 4,
        col: 4,
      },
      finish: {
        row: 34,
        col: 14,
      },
      selectAlgo: optionsAlgo[0],
      checkedDia: false,
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
      checkedDia,
    } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    console.log(checkedDia);
    const visitedNodesInOrder = (() => {
      switch (this.state.selectAlgo.value) {
        case "dijkstra":
          return dijkstras(grid, startNode, finishNode, checkedDia);
        case "aStar":
          return aStarLin(grid, startNode, finishNode, checkedDia);
        default:
          console.log("default");
          break;
      }
    })();
    // const visitedNodesInOrder = dijkstras(grid, startNode, finishNode);
    const nodesInShortestPath = getNodesInShortestPathOrder(finishNode);
    this.animateAlgo(
      visitedNodesInOrder,
      nodesInShortestPath,
      finishNode,
      startNode
    );
  }

  animateAlgo(visitedNodesInOrder, nodesInShortestPath, finishNode, startNode) {
    console.log(visitedNodesInOrder, "start animation");

    if (visitedNodesInOrder.length === 0) {
      //if no nodes were visited, there is no shortest path
      console.log(nodesInShortestPath, "no visited");
      if (nodesInShortestPath.length === 2) {
        this.animateShortestPath(nodesInShortestPath, finishNode, startNode);
      } else {
        startNode.noFinishFound = true;
        finishNode.noFinishFound = true;

        setTimeout(() => {
          finishNode.noFinishFound = false;
          startNode.noFinishFound = false;
          this.setState({ isRunning: false });
        }, 1000);
      }
    } else {
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        const curNode = visitedNodesInOrder[i];
        setTimeout(() => {
          document.getElementById(`node-${curNode.id}`).className =
            "node Visited";
        }, 10 * i);
        //start printing shortest path
        if (i === visitedNodesInOrder.length - 1) {
          setTimeout(
            () =>
              this.animateShortestPath(
                nodesInShortestPath,
                finishNode,
                startNode
              ),
            10 * i
          );
        }
      }
    }
  }

  animateShortestPath(nodesInShortestPath, finishNode, startNode) {
    console.log(nodesInShortestPath, "shortest");

    if (nodesInShortestPath.length === 1) {
      //animate Start and Finish Node if no Path was found
      startNode.noFinishFound = true;
      finishNode.noFinishFound = true;
      console.log("shortest not");
      setTimeout(() => {
        finishNode.noFinishFound = false;
        startNode.noFinishFound = false;
      }, 1000);
      this.setState({ isRunning: false });
    } else {
      for (let i = 0; i < nodesInShortestPath.length; i++) {
        const curNode = nodesInShortestPath[i];
        if (curNode.isStart) {
          setTimeout(() => {
            //animate in shortest path in line
            document.getElementById(`node-${curNode.id}`).className =
              "node ShortestS";
          }, 20 * i);
        } else if (curNode.isFinish) {
          setTimeout(() => {
            //animate in shortest path in line
            document.getElementById(`node-${curNode.id}`).className =
              "node ShortestF";
            this.setState({ isRunning: false });
          }, 20 * i);
        } else {
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
    }
  }

  startHandler() {
    this.runDijkstras();
    this.setState((prevState) => ({
      isStarted: true,
      isRunning: true,
    }));
  }

  // mouseClickHandler(row, col) {
  //   if (!this.state.isStarted) {
  //     let newGrid = gridToggleWall(this.state.grid, row, col);
  //     this.setState({ grid: newGrid, mouseDownOther: true });
  //   }
  // }
  mouseDownHandler(row, col) {
    if (!this.state.isStarted) {
      if (this.state.grid[row][col].isStart) {
        //down on start node
        this.setState({ mouseDownStart: true });
      } else if (this.state.grid[row][col].isFinish) {
        //down on finish node
        this.setState({ mouseDownFinish: true });
      } else {
        let newGrid = gridToggleWall(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseDownOther: true });
      }
    }
  }
  mouseEnterHandler(row, col) {
    if (!this.state.isStarted) {
      if (this.state.mouseDownStart) {
        //make node start
        let newGrid = this.state.grid;
        if (!this.state.grid[row][col].isFinish) {
          newGrid[this.state.start.row][this.state.start.col].isStart = false;
          newGrid[row][col].isStart = true;
          this.setState({ gird: newGrid, start: { row: row, col: col } });
        }
      } else if (this.state.mouseDownFinish) {
        //make node finish
        let newGrid = this.state.grid;
        if (!this.state.grid[row][col].isStart) {
          newGrid[this.state.finish.row][
            this.state.finish.col
          ].isFinish = false;
          newGrid[row][col].isFinish = true;
          this.setState({ gird: newGrid, finish: { row: row, col: col } });
        }
      } else if (this.state.mouseDownOther) {
        let newGrid = gridToggleWall(this.state.grid, row, col);
        this.setState({ grid: newGrid });
      }
    }
  }
  mouseLeaveNodeHandler(row, col) {
    // if (!this.state.isStarted) {
    //   if (this.state.mouseDownStart) {
    //     let newGrid = this.state.grid;
    //     if (newGrid[row][col].isFinish) {
    //       console.log("leave finish node");
    //       newGrid[this.state.start.row][this.state.start.col].isStart = false;
    //     }
    //     this.setState({ gird: newGrid });
    //   } else if (this.state.mouseDownFinish) {
    //     //reset finish node to old
    //     let newGrid = this.state.grid;
    //     if (newGrid[row][col].isStart) {
    //       newGrid[row][col].isFinish = false;
    //     }
    //     this.setState({ gird: newGrid });
    //   }
    // }
  }

  mouseUpHandler() {
    this.setState({
      mouseDownOther: false,
      mouseDownFinish: false,
      mouseDownStart: false,
    });
  }
  mouseLeaveGridHandler(row, col) {
    // this.setState((prevState) => {
    //   prevState.grid[prevState.start.row][prevState.start.col].isStart = true;
    //   prevState.grid[prevState.finish.row][
    //     prevState.finish.col
    //   ].isFinish = true;
    //   return {
    //     grid: prevState.grid,
    //     // mouseDownOther: false,
    //     // mouseDownFinish: false,
    //     // mouseDownStart: false,
    //   };
    // });
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
        if (curNode.isStart) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Start";
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else if (curNode.isFinish) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Finish";
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else if (curNode.isWall) {
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else {
          document.getElementById(`node-${curNode.id}`).className =
            "node Unused";
          curNode.isWall = false;
          curNode.isVisited = false;
          curNode.isShortest = false;
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
        if (curNode.isStart) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Start";
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } else if (curNode.isFinish) {
          document.getElementById(`node-${curNode.id}`).className =
            "node Finish";
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        } /*if (!curNode.isStart && !curNode.isFinish)*/ else {
          document.getElementById(`node-${curNode.id}`).className =
            "node Unused";
          curNode.isWall = false;
          curNode.isVisited = false;
          curNode.isShortest = false;
          curNode.distance = Infinity;
          curNode.predecessor = null;
        }
        // } else {
        //   curNode.isVisited = false;
        //   curNode.isShortest = false;
        //   curNode.distance = Infinity;
        //   curNode.predecessor = null;
        // }
      })
    );
    return grid;
  }

  selectChange = (selectedOption) => {
    this.setState({ selectAlgo: selectedOption });
    console.log(selectedOption);
  };

  handleCheck = (event) => {
    this.setState({ checkedDia: event.target.checked });
    console.log(event.target.checked);
  };
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
    return (
      <div onMouseUp={() => this.mouseUpHandler()}>
        <header className="PVHeader">
          <h1>Pathfinding Visualiser</h1>
          <div className="SelectBar">
            <Select
              // defaultValue={optionsF[1]}
              options={optionsAlgo}
              defaultValue={optionsAlgo[0]}
              styles={selectAlgoStyle}
              onChange={this.selectChange}
              value={this.state.selectAlgo}
              // formatGroupLabel={formatGroupLabel}
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checkedDia}
                onChange={this.handleCheck}
                name="checkDia"
                color="primary"
              />
            }
            label="Enable Diagonal Paths"
          />
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
            onMouseLeave={(row, col) => this.mouseLeaveGridHandler(row, col)}
          >
            {grid.map((row, rowIdx) => {
              return (
                <div key={`row${rowIdx}`}>
                  {row.map((node, colIdx) => (
                    <Node
                      key={`r${rowIdx}c${colIdx}`}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      noFinishFound={node.noFinishFound}
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
                      onMouseLeave={(row, col) =>
                        this.mouseLeaveNodeHandler(row, col)
                      }
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
            <img
              src="https://i.imgur.com/eDjDFo5.png"
              className="App-logo-2"
              alt="logo "
            />
            <div className="imgTest">hello</div>
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
    this.noFinishFound = false;
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
