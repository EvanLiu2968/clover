/** 先进后出 */
export class Stack {
  stack: any[];
  constructor() {
    this.stack = []
  }
  getSize():number {
    return this.stack.length
  }
  add(task:any) {
    this.stack.push(task)
    return this
  }
  get() {
    return this.stack.pop()
  }
}
/** 先进先出 */
export class Queue {
  stack: any[];
  constructor() {
    this.stack = []
  }
  getSize():number {
    return this.stack.length
  }
  add(task:any) {
    this.stack.push(task)
    return this
  }
  get() {
    return this.stack.shift()
  }
}