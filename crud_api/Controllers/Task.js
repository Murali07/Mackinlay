const Task = require("../Model/Task");

const getTasks = (req, res) => {
    res.send("I am the get tasks route");    
}

const createTask = (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
    });

    // task.save((err, task) => {
    //     if(err){
    //         res.send(err);
    //     }
    //     res.json(task);
    // });

    try{
        const newTask = task.save();
        res.status(201).json(newTask);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    getTasks,
    createTask
};