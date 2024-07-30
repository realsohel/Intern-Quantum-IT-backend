import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './db/db.js' 
import authRoute from "./routes/auth.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: true,
};

app.get("/", (req, res) => {
    res.send("hello server");
});

// MiddleWares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// Routing 
app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
    connectDB();
    console.log("server listening on port " + port);
    });