import db from "./config/database"
import express from 'express';
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";

const PORT = process.env.PORT || 3001;

const app = express()
app.use(cors());
app.use(express.json());
app.use(router);
db().then(() => console.log("Connection succesful!"));

try {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
} catch (error) {
    console.log(`Error occurred`);
}
