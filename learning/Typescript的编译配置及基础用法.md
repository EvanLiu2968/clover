## Typescript的编译配置及基础用法

TypeScript是ES6的超集，相对于ES6，TypeScript最大的改善是增加了类型系统。
加入类型检查有不少好处，例如：
- 静态类型检查, 可以在编译期检测可能存在的bug;
- IDE 智能提示 
- 代码重构 
- 可读性，因为它能清晰地表明你的意图

### Typescript的编译配置

跟babel转编译JS代码有点类似，例如：
```bash
 npm install -g typescript
 tsc hello.ts
```

### TypeScript的基本类型系统

- Boolean 布尔类型
```javascript
var male:boolean = true;
```

- Number数字类型
```javascript
var age:number = 18;
```

- String 字符串类型
```javascript
var name:string = "evanliu2968";
```

- Array 数组类型
```javascript
//数组-类型方式
var skills:Array<string>=['React','Vue','Angular','Node'];

//类型-数组方式
var hobbies:string[]=['前端','音乐','电影'];

//元组（Tuple）
let x:[string,number,boolean];
x=["hello",1,true];
console.log(x[0])//hello
x=[1,1,1];//报错
```

- 枚举类型
```javascript
enum color {red,green,blue};
let c:color=color.green;
console.log(c)//1
```

- Any类型
```javascript
var something;
//这样的声明等同于
var something:any;
```

- Void类型
```javascript
//表示函数无返回值
function action(name:string):void {
  //some codes
}
```

- Null和Undefined类型
```javascript
let u: undefined = undefined;
let n: null = null;
```

- Never类型
返回never的函数必须存在无法达到的终点
```javascript

function error(message:string): never {
  throw new Error(message);
}

// 推断的返回值类型为never(永远不可能执行到最后)
function fail(direction:boolean) {
  if(direction){
    return 1;
  }else{
    return -1;
  }
  return error("永远不应该到这里");
}
```