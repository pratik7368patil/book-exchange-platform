import express from "express";
import User from "../models/User";
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error("Error while getting user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.post("/", async (req, res): Promise<any> => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Email and password are required", error: true });
    }

    const userWithSameEmail = await User.findOne({ email: req.body.email });
    if (userWithSameEmail) {
      return res.status(400).send({ message: "Email already exists", error: true });
    }

    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    console.error("Error while creating user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.updateOne({ id: req.params.id }, req.body);
    res.send(user);
  } catch (error) {
    console.error("Error while updating user", error);
    res.status(500).send({ message: error, error: true });
  }
});

router.delete("/:id", async (req, res): Promise<any> => {
  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).send({ message: "User not found", error: true });
    }

    const user = await User.deleteOne({ id: req.params.id });
    res.send(user);
  } catch (error) {
    console.error("Error while deleting user", error);
    res.status(500).send({ message: error, error: true });
  }
});

export default router;
