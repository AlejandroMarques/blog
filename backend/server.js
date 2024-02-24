const { connection } = require("./database/connection.js");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

function serverUp() {
  const app = express();
  const port = process.env.PORT;
  
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const articleRouter = require("./routes/article.js");
  app.use("/api", articleRouter.router);

  app.get("/test", (req, res) => {
    res.status(200).send("Hello World");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connection();
  });
}

serverUp();
