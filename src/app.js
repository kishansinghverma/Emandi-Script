import express from "express";
import cors from "cors";
import path, { resolve } from "path";

const app = express();
app.use(cors())
app.use('/public', express.static(path.join(resolve(), 'src', 'public')));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));