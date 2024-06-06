import { Task } from "../models/task.js";
import ErrorHandler from "../middlewares/error.js";

export const newTask = async(req,res,next)=>{
    try{
    const {title, description}=req.body;
    const task=await Task.create({
        title,
        description,
        user:req.user,
    })
    console.log(task)
    res.status(201).json({
        success:true,
        message:"Task added Successfully"
    })
}catch (error) {
    next(error);
  }
}

export const getMyTask = async(req,res,next)=>{
    try{
    const userid = req.user._id;

    const tasks =await Task.find({user:userid})

    res.status(200).json({
        super:true,
        tasks,
    })
}catch (error) {
    next(error);
  }

}

export const updateTask =async(req,res,next) =>{
    try{
    const task = await Task.findById(req.params.id);

    if(!task)
    {
        return next(new ErrorHandler("Task not found", 404));
    }
    console.log(task.isCompleted)
    task.isCompleted = !task.isCompleted;
    await task.save();
    console.log(task.isCompleted)

    res.status(200).json({
        success:true,
        message:"task completed"
    })
}catch (error) {
    next(error);
  }
}

export const deleteTask = async (req,res,next)=>{
    try{
    const task = await Task.findById(req.params.id);
     
    if (!task) return next(new ErrorHandler("Task not found", 404));
    
    await task.deleteOne();

    res.status(200).json({
        message:"Task Deleted",
        success:true,
    })
}catch(error){
    next(error)
}

}