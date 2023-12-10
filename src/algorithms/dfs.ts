export function findCycleLength<ValueType, Options, NodeType extends DfsNode<ValueType, Options>>(
  start: NodeType,
  options: Options
) {
  const lastNodeInCycle = findLastNodeInCycle(start, options);
  return lastNodeInCycle.getDistanceToStart() + 1;
}

export function findLastNodeInCycle<ValueType, Options, NodeType extends DfsNode<ValueType, Options>>(
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
export function findTargetWithDfs<NodeType extends DfsNode<unknown, Options>, Options>(
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
export function findTargetsWithDfs<NodeType extends DfsNode<unknown, Options>, Options>(
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
 * Generic node type for depth-first search (DFS)
 */
export abstract class DfsNode<ValueType, Options> {
  value!: ValueType;

  nodeState = {
    checked: false,
    previousNode: undefined as DfsNode<ValueType, Options> | undefined,
  };

  abstract getAdjacentNodes(options: Options): DfsNode<ValueType, Options>[];

  getDistanceToStart(): number {
    let distance = 0;
    let previousNode = this.nodeState.previousNode;
    while (previousNode) {
      distance++;
      previousNode = previousNode.previousNode;
    }
    return distance;
  }

  getPath<NodeType extends DfsNode<ValueType, Options>>(): NodeType[] {
    const path: NodeType[] = [this as unknown as NodeType];
    let previousNode = this.previousNode;
    while (previousNode) {
      path.push(previousNode as NodeType);
      previousNode = previousNode.previousNode;
    }
    return path;
  }

  get startNode(): DfsNode<ValueType, Options> {
    return (this.nodeState.previousNode && this.nodeState.previousNode.startNode) || this;
  }

  get previousNode() {
    return this.nodeState.previousNode;
  }

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
    };
  }
}
