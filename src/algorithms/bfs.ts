import { GraphNode } from './graph-node';

/**
 * Generic bredth-first seach implementation
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetWithBfs<ValueType, Options, NodeType extends BfsNode<ValueType, Options>>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options
) {
  const results = findTargetsWithBfs(start, isTargetNode, options, true);
  if (results.size) {
    return results.values().next().value;
  }
  throw new Error('Target not found');
}
/**
 * Generic bredth-first seach implementation for finding all matching nodes.
 * Iterates through whole graph.
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetsWithBfs<ValueType, Options, NodeType extends BfsNode<ValueType, Options>>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
  firstOnly = false
) {
  const nodesToCheck: NodeType[] = [start];
  let currentNode = start;
  const results = new Set<NodeType>();
  while (nodesToCheck.length) {
    // A dequeue would be a better solution due to shift's O(n) complexity, but is performant enough
    currentNode = nodesToCheck.shift()!;
    if (currentNode.nodeState.checked) {
      continue;
    }
    currentNode.nodeState.checked = true;

    for (const node of currentNode.getAdjacentNodes(options) as NodeType[]) {
      if (!node.nodeState.previousNode && node !== start) {
        nodesToCheck.push(node);
        node.nodeState.previousNode = currentNode;
      }
      if (isTargetNode(node)) {
        results.add(node);
        if (firstOnly) {
          return results;
        }
      }
    }
  }
  return results;
}

/**
 * Generic node type for breadth-first search (BFS)
 */
export abstract class BfsNode<ValueType, Options> extends GraphNode<BfsNode<ValueType, Options>> {
  value!: ValueType;

  nodeState = {
    checked: false,
    previousNode: undefined as BfsNode<ValueType, Options> | undefined,
  };

  abstract getAdjacentNodes(options: Options): BfsNode<ValueType, Options>[];

  getDistanceToStart(): number {
    if (this.nodeState.previousNode) {
      return this.nodeState.previousNode.getDistanceToStart() + 1;
    }
    return 0;
  }

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
    };
  }
}
