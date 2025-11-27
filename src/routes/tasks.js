const express = require("express");
const auth = require("../middlewares/auth");
const tasksController = require("../controllers/tasks");

const router = express.Router();

// Protect all task routes
const validate = require("../middlewares/validate");
const { createTaskSchema, updateTaskSchema } = require("../utils/validations");

router.use(auth);

router.post("/", validate(createTaskSchema), tasksController.createTask);
router.get("/", tasksController.getTasks);
router.put("/:id", validate(updateTaskSchema), tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
