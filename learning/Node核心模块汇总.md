## Node核心模块汇总

### 模块内全局变量
- `__filename`
- `__dirname`
- `exports`, `module`, `require()`

### process
- `process.env`
- `process.argv`
- `process.cwd()`
- `process.exit([code])` 成功结束：`process.exit(0)`
- `process.nextTick(callback[, ...args])` 相当于`setImmediate`

### events
核心模块，基本基于事件模型的模块都继承于它，例如：`Stream`, `fs`, `http`, `koa`等

- `emitter.off(eventName, listener)`
- `emitter.on(eventName, listener)`
- `emitter.once(eventName, listener)`
- `emitter.addListener(eventName, listener)`
- `emitter.prependListener(eventName, listener)`
- `emitter.prependOnceListener(eventName, listener)`
- `emitter.removeAllListeners([eventName])`
- `emitter.removeListener(eventName, listener)`
- `emitter.setMaxListeners(n)`
- `emitter.rawListeners(eventName)`
- `emitter.emit(eventName[, ...args])`
- `emitter.eventNames()`
- `emitter.getMaxListeners()`
- `emitter.listenerCount(eventName)`
- `emitter.listeners(eventName)`

### fs
- `fs.readFile()`
- `fs.readFileSync()`
- `fs.writeFile(file, data[, options], callback)`
- `fs.read(fd, buffer, offset, length, position, callback)`
- `fs.stat(path, callback)`
- `fs.open`
- `fs.close`
- `fs.unlink(path, callback)`
- `fs.mkdir(path[, mode], callback)`
- `fs.readdir(path, callback)`
- `fs.rmdir(path, callback)`

### path

#### path.join([path1][, path2][, ...])
用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。

#### path.resolve([from ...], to)
将 to 参数解析为绝对路径。

#### path.resolve(from, to)
用于将相对路径转为绝对路径。

#### path.dirname(p)
返回路径中代表文件夹的部分，同 Unix 的dirname 命令类似。

#### path.normalize(p)
规范化路径，注意'..' 和 '.'。

#### path.isAbsolute(path)
判断参数 path 是否是绝对路径。

#### path.basename(p[, ext])
返回路径中的最后一部分。同 Unix 命令 bashname 类似。

#### path.extname(p)
返回路径中文件的后缀名，即路径中最后一个'.'之后的部分。如果一个路径中并不包含'.'或该路径只包含一个'.' 且这个'.'为路径的第一个字符，则此命令返回空字符串。

#### path.parse(pathString)
返回路径字符串的对象。

#### path.format(pathObject)
从对象中返回路径字符串，和 path.parse 相反。

### other
- `cluster`
- `child_process`
- `http`, `https`
- `url`
- `crypto`
- `os`
- `net`
- `dns`
- `domain`