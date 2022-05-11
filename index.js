const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");


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
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin : '*',
  })
);
app.use(cookieParser());

// //multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });
// const upload = multer({ storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     res.status(200).json({
//       status: "successful",
//       message: "file uploaded",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation",conversationRoute);
app.use("/api/message",messageRoute);

app.listen(PORT, () => {
  console.log(`istening at port ${PORT} `);
});
