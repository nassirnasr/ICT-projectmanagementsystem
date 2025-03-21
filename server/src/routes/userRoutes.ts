import { Router } from "express";
import { getUsers } from "../Controllers/userController";

const router = Router();

router.get("/", getUsers);

export default router;