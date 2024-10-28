import express, { Request, Response } from "express";
import cookies from "cookie-parser";
import dotenv from "dotenv";
import routers from "./routes/routers";

dotenv.config();
const app = express();

app.use(cookies());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).send({
        response: "Hello Type",
    });
});

app.use(routers);

app.listen(process.env.APP_PORT, () => {
    console.log(`${process.env.APP_NAME} is running on port ${process.env.APP_PORT}`);
});