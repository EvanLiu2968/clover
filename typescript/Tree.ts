interface INode {
  value: any,
  left: INode | null,
  right: INode | null
}
class Node {
  value: any;
  left: INode | null;
  right: INode | null;
  constructor(value:any, left:INode | null = null, right:INode | null = null) {
    this.value = value
    this.left = left
    this.right = right
  }
}

export default class Tree {
  size: number;
  root: INode | null;
  constructor() {
    this.size = 0
    this.root = null
  }
  getSize():number {
    return this.size
  }
  isEmpty():boolean {
    return this.size === 0
  }
  addNode(v):void {
    this.root = this._addChild(this.root, v)
  }
  // 添加节点时，需要比较添加的节点值和当前节点值的大小
  _addChild(node, v):INode {
    if (!node) {
      this.size++
      return new Node(v)
    }
    if (node.value > v) {
      node.left = this._addChild(node.left, v)
    } else if (node.value < v) {
      node.right = this._addChild(node.right, v)
    }
    return node
  }
}