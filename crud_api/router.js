const { getTasks, createTask, updateTask, deleteTask } = require("./Controllers/Task");

const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Welcome to Mackinlay!");
});

router.get("/getTasks", getTasks);

router.post("/createTasks", createTask);

router.put("/updateTasks/:taskID", updateTask);

router.delete("/deleteTasks/:taskID", deleteTask);

module.exports = router;