/**
 * code test
 */

/**
 * 请写出以下代码的输出结果
 */
var a, b= null;
console.log (a, typeof a);
console.log (b, typeof b);
console.log (c, typeof c);
console.log (Object.create({}) instanceof Object);
console.log (Object.create(null) instanceof Object);

/**
 * 请完成一个函数用正则匹配字符串是否是指定域名(xiao100.com)的邮箱，用户名只能为大小写字母、数字、下划线_
 * 如: xhvip100@xiao100.com，返回Boolean
 */
function validateXiaoEmail(str) {
  // todo
}

/**
 * 请返回所有实参之和
 */
function getArgsSum() {
  // todo
}

/**
 * 有一个大数组,var a = [1, 2, 3, ...100];
 * 请先构造此数组, 然后设计一个算法将其完全打乱顺序
 */
function getDisorderArray() {
  // todo
}

/**
 * 说明如下函数运行的结果
 */
async function testTick() {
  setImmediate(() => {
    console.log('0')
  })
  process.nextTick(() => {
    console.log('1')
  })
  setTimeout(() => {
    console.log('2')
  }, 1000)
  
  console.log('3')
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
      console.log('4')
    }, 1000)
    console.log('5')
  }).then(() => {
    console.log('6')
  })
  setTimeout(() => {
    console.log('7')
  }, 1000)
}
testTick()

/**
 * 如何设计一个dialog组件？写出API文档及思路，技术栈不限
 */


/**
 * 如何设计一个事件模型？类似node的events模块、或者eventbus
 */






