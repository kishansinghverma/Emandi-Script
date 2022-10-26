const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use('/static', express.static('static'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));