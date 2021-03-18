import { NUMBER_ROWS } from "./../PathfindingVisualizer";
import { NUMBER_COLLUMS } from "./../PathfindingVisualizer";

export function dijkstras(grid, startNode, finishNode) {
  startNode.distance = 0;
  let heap = [];
  let visitedNodesInOrder = [];
  heap.push(startNode);
  console.log(startNode, "Start Dijkstras");
  while (!!heap.length) {
    // console.log('while loop');
    let curNode = heap.shift();
    // curNode.isVisited = true;
    addNeighbors(curNode, heap, grid);
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
function addNeighbors(curNode, heap, grid) {
  let { row, col } = curNode;
  let untouchedNeighbors = newNeighbors(row, col, grid);
  // console.log(untouchedNeighbors,'untouchedN')
  // for(let neighbor in untouchedNeighbors){
  //     neighbor.distance = curNode.distance + 1;
  //     neighbor.predecessor = curNode;
  //     heap.push(neighbor);
  // }
  untouchedNeighbors.forEach((neighbor) => {
    neighbor.distance = curNode.distance + 1;
    neighbor.predecessor = curNode;
    heap.push(neighbor);
  });
}
//return all neighbors that didnt got a distance yet, therefor being untouched
function newNeighbors(row, col, grid) {
  let neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < NUMBER_ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < NUMBER_COLLUMS - 1) neighbors.push(grid[row][col + 1]);
  // console.log(neighbors,'newNeighbors');
  return neighbors.filter(
    (neighbor) =>
      neighbor.distance === Infinity && !(neighbor.isWall && !neighbor.isFinish)
  );
}

export function getNodesInShortestPathOrder(finishNode) {
  let curNode = finishNode;
  let shortestPath = [];
  while (curNode != null) {
    shortestPath.unshift(curNode);
    curNode = curNode.predecessor;
  }
  shortestPath.pop();
  shortestPath.shift();
  return shortestPath;
}
