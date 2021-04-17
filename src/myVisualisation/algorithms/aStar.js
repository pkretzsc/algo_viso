import { NUMBER_ROWS } from "./../PathfindingVisualizer";
import { NUMBER_COLLUMS } from "./../PathfindingVisualizer";

export function aStarLin(grid, startNode, finishNode, checkedDia) {
  startNode.distance = {
    gCost: 0,
    hCost: calcCostLin(startNode, finishNode),
    fCost: calcCostLin(startNode, finishNode),
  };
  let heap = [];
  let visitedNodesInOrder = [];
  heap.push(startNode);
  console.log(startNode, "Start aStarLin");
  while (!!heap.length) {
    // console.log('while loop');
    heap.sort((a, b) => {
      let diff = a.distance.fCost - b.distance.fCost;
      if (diff !== 0) {
        return diff;
      } else {
        return a.distance.hCost - b.distance.hCost;
      }
    });
    let curNode = heap.shift();
    // curNode.isVisited = true;
    if (checkedDia) {
      addNeighborsDia(curNode, heap, grid, finishNode, visitedNodesInOrder);
    } else {
      addNeighborsLin(curNode, heap, grid, finishNode, visitedNodesInOrder);
    }

    // console.log(heap.length, 'heap length');
    visitedNodesInOrder.push(curNode);
    if (curNode.id === finishNode.id) {
      visitedNodesInOrder.shift();
      visitedNodesInOrder.pop();
      return visitedNodesInOrder;
    }
  }
  console.log("finish not found");
  visitedNodesInOrder.shift();
  return visitedNodesInOrder;
}
//get the untouched Neighbors of curNode and init them and push them into the heap
function addNeighborsLin(curNode, heap, grid, finishNode, visitedNodesInOrder) {
  let { row, col } = curNode;
  let untouchedNeighbors = newNeighborsLin(row, col, grid, visitedNodesInOrder);
  // console.log(untouchedNeighbors,'untouchedN')
  // for(let neighbor in untouchedNeighbors){
  //     neighbor.distance = curNode.distance + 1;
  //     neighbor.predecessor = curNode;
  //     heap.push(neighbor);
  // }
  untouchedNeighbors.forEach((neighbor) => {
    let gCost = curNode.distance.gCost + calcCostLin(curNode, neighbor);
    let hCost = calcCostLin(neighbor, finishNode);
    let fCost = gCost + hCost;

    if (neighbor.distance === Infinity) {
      //if node havent been touched put it into the heap
      neighbor.predecessor = curNode;
      neighbor.distance = {
        gCost: gCost,
        hCost: hCost,
        fCost: fCost,
      };
      heap.push(neighbor);
    } else if (neighbor.distance.fCost > fCost) {
      //if it was touched but the new path is faster update the node
      neighbor.predecessor = curNode;
      neighbor.distance = {
        gCost: gCost,
        hCost: hCost,
        fCost: fCost,
      };
    }
  });
}
//return all neighbors that didnt got a distance yet, therefor being untouched
function newNeighborsLin(row, col, grid, visitedNodesInOrder) {
  let neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < NUMBER_ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < NUMBER_COLLUMS - 1) neighbors.push(grid[row][col + 1]);
  // console.log(neighbors,'newNeighbors');
  return neighbors.filter(
    (neighbor) =>
      !visitedNodesInOrder.includes(neighbor) &&
      !(neighbor.isWall && !neighbor.isFinish)
  );
}
function addNeighborsDia(curNode, heap, grid, finishNode, visitedNodesInOrder) {
  let { row, col } = curNode;
  let untouchedNeighbors = newNeighborsDia(row, col, grid, visitedNodesInOrder);
  // console.log(untouchedNeighbors,'untouchedN')
  // for(let neighbor in untouchedNeighbors){
  //     neighbor.distance = curNode.distance + 1;
  //     neighbor.predecessor = curNode;
  //     heap.push(neighbor);
  // }
  untouchedNeighbors.forEach((neighbor) => {
    let gCost = curNode.distance.gCost + calcCostDia(curNode, neighbor);
    let hCost = calcCostDia(neighbor, finishNode);
    let fCost = gCost + hCost;

    if (neighbor.distance === Infinity) {
      //if node havent been touched put it into the heap
      neighbor.predecessor = curNode;
      neighbor.distance = {
        gCost: gCost,
        hCost: hCost,
        fCost: fCost,
      };
      heap.push(neighbor);
    } else if (neighbor.distance.fCost > fCost) {
      //if it was touched but the new path is faster update the node
      neighbor.predecessor = curNode;
      neighbor.distance = {
        gCost: gCost,
        hCost: hCost,
        fCost: fCost,
      };
    }
  });
}

function newNeighborsDia(row, col, grid, visitedNodesInOrder) {
  let neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
  if (row < NUMBER_ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (row > 0 && col < NUMBER_COLLUMS - 1)
    neighbors.push(grid[row - 1][col + 1]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < NUMBER_ROWS - 1 && col > 0) neighbors.push(grid[row + 1][col - 1]);
  if (col < NUMBER_COLLUMS - 1) neighbors.push(grid[row][col + 1]);
  if (row < NUMBER_ROWS - 1 && col < NUMBER_COLLUMS - 1)
    neighbors.push(grid[row + 1][col + 1]);
  // console.log(neighbors,'newNeighbors');
  return neighbors.filter(
    (neighbor) =>
      !visitedNodesInOrder.includes(neighbor) &&
      !(neighbor.isWall && !neighbor.isFinish)
  );
}
function calcCostDia(nodeA, nodeB) {
  let distRow = Math.abs(nodeB.row - nodeA.row);
  let distCol = Math.abs(nodeB.col - nodeA.col);
  return (
    14 * Math.min(distCol, distRow) +
    10 * (Math.max(distRow, distCol) - Math.min(distRow, distCol))
  );
}
function calcCostLin(nodeA, nodeB) {
  return (
    10 * (Math.abs(nodeB.row - nodeA.row) + Math.abs(nodeB.col - nodeA.col))
  );
}

export function getNodesInShortestPathOrder(finishNode) {
  let curNode = finishNode;
  let shortestPath = [];
  while (curNode != null) {
    shortestPath.unshift(curNode);
    curNode = curNode.predecessor;
  }
  // shortestPath.pop();
  // shortestPath.shift();
  return shortestPath;
}
