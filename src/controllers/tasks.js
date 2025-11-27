const Task = require("../models/task");
const redis = require("../config/redis");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const task = await Task.create({ title, description, userId });

    // Invalidate cache
    await redis.del(`tasks:${userId}`);

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Create task failed" });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = `tasks:${userId}`;

    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const tasks = await Task.findAll({ where: { userId } });

    await redis.set(
      key,
      JSON.stringify(tasks),
      "EX",
      Number(process.env.CACHE_TTL || 600)
    );

    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Get tasks failed" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id, userId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.update(req.body);

    // Invalidate cache
    await redis.del(`tasks:${userId}`);

    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id, userId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();

    // Invalidate cache
    await redis.del(`tasks:${userId}`);

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
