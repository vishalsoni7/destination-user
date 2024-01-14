const express = require("express");
const app = express();
const cors = require("cors");

const initializeDatabase = require("./db");

const destinationRouter = require("./routers/destination.router");

const userRouter = require("./routers/user.router");

app.use(express.json());

initializeDatabase();

// const corsOptions = {
//   origin: "*",
//   optionsSuccessStatus: 200,
// };

app.use(cors("*"));

app.get("/", (req, res) => {
  res.send("Welcome to the TripAdvisor realm.");
});

app.use("/destinations", userRouter);

app.use("/destinations", destinationRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "something went wrong" });
});

app.listen(3000, () => {
  console.log("server started");
});
