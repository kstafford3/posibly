# Posibly
## Compare and Convert Part-of-Speech Tagged Sentences to Expected Grammar.

[![npm version](https://badge.fury.io/js/posibly.svg)](https://www.npmjs.com/package/posibly)
[![Build Status](https://travis-ci.org/kstafford3/posibly.svg?branch=mater)](https://travis-ci.org/kstafford3/posibly)
---

# Install
```
npm install --save posibly
```

# Initialize
```js
const Posibly = require('posibly');
const posibly = new Posibly(['V', 'DT', 'N']);
```

# Compare
```js
// using posibly from above
const tagged = [ [ 'eat', 'V' ], [ 'food', 'N' ] ];
const editPath = posibly.editPath(tagged);
// editPath.distance = 1
```

# Convert
```js
// using editPath from above
const retagged = editPath.retag();
/*
  retagged = [
    [ 'eat', 'V' ],
    [ null, 'DT' ],
    [ 'food', 'N' ],
  ]
*/
```

---

Copyright 2017, Kyle Stafford (MIT License).