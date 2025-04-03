// root of node js application
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import concurrently from "concurrently";
import bodyParser from "body-parser";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"
import searchRoutes from "./routes/searchRoutes"
import userRoutes from "./routes/userRoutes"
import teamRoutes from "./routes/teamRoutes"

/*     CONFIGURATIONS     */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cors());

/*          ROUTES        */
app.get('/' , (req, res) => {
    res.send("This is the home route ");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search" , searchRoutes);
app.use("/users" , userRoutes);
app.use("/teams", teamRoutes);

/*      SERVER           */
const port = process.env.PORT || 3000;
app.listen(port , () => {
    console.log(`Server running on port ${port}`);
})