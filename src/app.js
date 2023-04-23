const express = require("express");
const app = express();
var cors = require('cors')
const port = process.env.PORT || 3001;

app.use(cors())
app.use('/static', express.static('static'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
