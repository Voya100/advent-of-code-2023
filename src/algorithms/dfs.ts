import { sum } from '../utils';
import { GraphNode } from './graph-node';

export function findCycleLength<NodeType extends DfsNode<NodeType, Options>, Options>(
  start: NodeType,
  options: Options
) {
  const lastNodeInCycle = findLastNodeInCycle(start, options);
  return lastNodeInCycle.getDistanceToStart() + 1;
}

export function findLastNodeInCycle<NodeType extends DfsNode<NodeType, Options>, Options>(
  start: NodeType,
  options: Options
) {
  return findTargetWithDfs(
    start,
    (node) => node.getAdjacentNodes(options).includes(start) && node.nodeState.previousNode !== start,
    options
  );
}

/**
 * Generic depth-first seach implementation
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetWithDfs<NodeType extends DfsNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options
): NodeType {
  const results = findTargetsWithDfs(start, isTargetNode, options, true);
  if (results.size) {
    return results.values().next().value;
  }
  throw new Error('Target not found');
}

/**
 * Generic depth-first seach implementation for finding all matching nodes.
 * Iterates through whole graph.
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetsWithDfs<NodeType extends DfsNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
  firstOnly = false
) {
  const nodesToCheck: NodeType[] = [start];
  let currentNode = start;
  const results = new Set<NodeType>();
  while (nodesToCheck.length) {
    const previousNode = currentNode;
    currentNode = nodesToCheck.pop()!;
    if (currentNode.nodeState.checked) {
      continue;
    }
    currentNode.nodeState.checked = true;
    if (previousNode !== currentNode) {
      currentNode.nodeState.previousNode = previousNode;
    }

    if (isTargetNode(currentNode)) {
      results.add(currentNode);
      if (firstOnly) {
        return results;
      }
    }

    for (const node of currentNode.getAdjacentNodes(options) as NodeType[]) {
      if (!node.nodeState.checked) {
        nodesToCheck.push(node);
      }
    }
  }
  return results;
}

/**
 * Finds longest path to target with DFS and returns its length
 */
export function findLongestPathLengthWithDfs<NodeType extends DfsNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  getWeight: (node: NodeType) => number,
  options: Options
) {
  const path = [start];
  const pathSet = new Set([start]);
  let longestPath = 0;
  const nextNodes: [NodeType, NodeType][] = start.getAdjacentNodes(options).map((node) => [start, node]);

  while (nextNodes.length) {
    const [previousNode, currentNode] = nextNodes.pop()!;
    if (path[path.length - 1] !== previousNode) {
      while (path[path.length - 1] !== previousNode) {
        pathSet.delete(path.pop()!);
      }
    }
    path.push(currentNode);
    pathSet.add(currentNode);
    if (isTargetNode(currentNode)) {
      const pathLength = sum(path, getWeight) - 1;
      longestPath = Math.max(longestPath, pathLength);
    }

    for (const node of currentNode.getAdjacentNodes(options)) {
      if (!pathSet.has(node)) {
        nextNodes.push([currentNode, node]);
      }
    }
  }
  return longestPath;
}

/*export function findAllPathsWithDfs<NodeType extends DfsNode<NodeType, Options>, Options>(
  path: NodeType[],
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
  paths: NodeType[][] = []
) {
  const currentNode = path[path.length - 1];

  if (isTargetNode(currentNode)) {
    paths.push([...path]);
    return paths;
  }

  for (const node of currentNode.getAdjacentNodes(options)) {
    if (!path.includes(node)) {
      path.push(node);
    }
    findAllPathsWithDfs(path, isTargetNode, options, paths);
    path.pop();
  }
  return paths;
}*/

/**
 * Generic node type for depth-first search (DFS)
 */
export abstract class DfsNode<NodeType extends DfsNode<NodeType, Options>, Options> extends GraphNode<NodeType> {
  nodeState = {
    checked: false,
    previousNode: undefined as NodeType | undefined,
  };

  abstract getAdjacentNodes(options: Options): NodeType[];

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
    };
  }
}
