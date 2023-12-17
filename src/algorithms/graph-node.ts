type NodeState<Node> = {
  previousNode?: Node;
};

export abstract class GraphNode<NodeType extends GraphNode<NodeType>> {
  nodeState: NodeState<NodeType> = {
    previousNode: undefined,
  };

  getDistanceToStart(): number {
    let distance = 0;
    let previousNode = this.nodeState.previousNode;
    while (previousNode) {
      distance++;
      previousNode = previousNode.previousNode;
    }
    return distance;
  }

  getPath(): NodeType[] {
    const path: NodeType[] = [this as unknown as NodeType];
    let previousNode = this.previousNode;
    while (previousNode) {
      path.push(previousNode);
      previousNode = previousNode.previousNode;
    }
    return path;
  }

  get startNode(): NodeType {
    return (this.nodeState.previousNode && this.nodeState.previousNode.startNode) || (this as unknown as NodeType);
  }

  get previousNode() {
    return this.nodeState.previousNode;
  }
}
