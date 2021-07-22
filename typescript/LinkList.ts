interface INode {
  value: any,
  next: INode | null
}
class Node {
  value: any;
  next: INode | null;
  constructor(value:any, next:INode | null = null) {
    this.value = value
    this.next = next
  }
}

export default class LinkList {
  size: number;
  NodeList: INode;
  constructor() {
    this.size = 0
    this.NodeList = new Node(null, null)
  }
  hasNode(index):boolean {
    return index >= 0 && index <= this.size
  }
  getNode(header:INode, index:number, currentIndex:number = 0):INode {
    if (index === currentIndex) return header
    return this.getNode(header.next, index, currentIndex+1)
  }
  setNode(v:INode, index:number):INode {
    if (!this.hasNode(index)) throw new Error('Node is not exist!')

    const prev = this.getNode(this.NodeList, index)
    prev.next = new Node(v, prev.next)
    this.size++
    return prev.next
  }
  removeNode(index:number):INode {
    if (!this.hasNode(index)) throw new Error('Node is not exist!')

    const prev = this.getNode(this.NodeList, index)
    const node = prev.next
    prev.next = node.next
    node.next = null
    this.size--
    return node
  }
}
