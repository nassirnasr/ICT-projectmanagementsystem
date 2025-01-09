import { Router } from "express";
import { getTeams } from "../Controllers/teamController";

const router = Router();

router.get("/", getTeams);

export default router;