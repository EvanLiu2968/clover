
## Babel

### import
```javascript
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
```

### bind
```javascript
var config = {
  author: 'evanliu'
}
var func = config::function(){
  console.log(this.author) // evanliu
}
```

### deconstruction
```javascript
var func = (url,option,callback) => {
  const [u,opt,cb] = arguments
}
const {
  show,
  bigData
} = this.props
```
