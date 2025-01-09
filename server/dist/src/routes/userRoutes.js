"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userContriller_1 = require("../Controllers/userContriller");
const router = (0, express_1.Router)();
router.get("/", userContriller_1.getUsers);
exports.default = router;
