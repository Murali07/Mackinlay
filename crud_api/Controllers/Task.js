const Task = require("../Model/Task");

const getTasks = async (req, res) => {

    try {
        const result = await Task.find();
        res.send(result);        
    } catch (err) {
        res.status(400).json({message: err.message});
    }       
}

const createTask = async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
    });    

    try{
        const newTask = await task.save();
        res.status(201).json(newTask);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}

const updateTask = async (req, res) => {

    try{
        const editTask = await Task.findOneAndUpdate(
            {_id: req.params.taskID},
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                },
            },
            { new: true },    
        );
        res.send(editTask)
    }
    catch(err){
        res.status(500).json(err.message);
    }
}


const deleteTask = async (req, res) => {
    try{
        const result = await Task.deleteOne({ _id: req.params.taskID });
        res.send(result);
    } catch(err){
        res.status(500).json(err.message);
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};