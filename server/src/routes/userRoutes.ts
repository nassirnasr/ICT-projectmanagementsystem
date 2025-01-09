import { Router } from "express";
import { getUsers } from "../Controllers/userContriller";

const router = Router();

router.get("/", getUsers);

export default router;