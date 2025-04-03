import { Router } from "express";
import { search } from "../Controllers/searchController";

const router = Router();

router.get("/", search);


export default router;