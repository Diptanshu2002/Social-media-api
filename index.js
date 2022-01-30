const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//DOT ENV configuration
dotenv.config();

//DB CONNECTION
mongoose.connect(
  process.env.LOCAL_MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to mondo db server");
  }
);
//PORT
const PORT = process.env.PORT || 8080;

//APP DEclaration
const app = express();

//middle wares

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => {
  console.log(`istening at port ${PORT} `);
});
