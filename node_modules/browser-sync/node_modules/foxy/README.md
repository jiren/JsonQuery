##Foxy [![Build Status](https://travis-ci.org/shakyShane/foxy.svg?branch=master)](https://travis-ci.org/shakyShane/foxy)

Proxy with response moddin'

If your local development server was running at `http://127.0.0.1:5000`, then you use Foxy
like this: 

```js
var foxy = require("foxy");

var proxy = foxy.init("http://127.0.0.1:5000").listen(function () {
    console.log("Foxy running at http://localhost:" + proxy.address().port);
});
```

Built-in middleware will re-write html on the fly to update any urls & there'll also be the option
for additional rules for the re-writing.


