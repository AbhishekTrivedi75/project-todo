import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.js"
import taskRouter from "./routes/task.js"
import { config } from "dotenv"
import { errorMiddleware } from "./middlewares/error.js"
import cors from "cors"
export const app = express()

config({
    path: "./data/config.env"
})

app.set("view engine","ejs")

app.use(express.static(path.join(path.resolve(),"public")))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(express.json());
app.use( 
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
)
//using routes
app.use("/users",userRouter) 
app.use("/tasks",taskRouter)
app.get("/",(req,res)=>{
    res.send("Nice Working")
})

//using error middleware
app.use(errorMiddleware);

