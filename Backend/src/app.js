import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app =express();
// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true
// }))

app.use(cors({
    origin: "https://abuzar-bench-portal.netlify.app",
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    
}));


app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // for url  encoded data
app.use(express.static("public"));  // to serve static files css js
app.use(cookieParser());

import userRouter from "./routes/user.route.js"
import adminRouter from "./routes/admin.route.js"
import applicationRouter from "./routes/application.route.js"
app.use("/api/v1/users",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/application",applicationRouter)
app.get("/",(req,res)=>{
    res.send("hello world welcome")
})

export {app}