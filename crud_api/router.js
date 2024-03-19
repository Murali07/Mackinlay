const { getTasks, createTask } = require("./Controllers/Task");

const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Welcome to Mackinlay!");
});

// router.get("/tasks", getTasks);

router.post("/tasks", createTask);

module.exports = router;