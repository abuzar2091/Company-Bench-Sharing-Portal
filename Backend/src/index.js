import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env"
})

const port=process.env.PORT;
connectDB()
.then(()=>{
     app.on("error", (error) => {
        console.log("port is not listening", error);
        throw error;
      });
     app.listen(port || 8000,()=>{
        console.log(`PORT is listening on port ${port}`);
     })
})
.catch(err => console.log("MONGODB connection failed ",err));