"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Game_1 = __importDefault(require("@/models/Game"));
const response_1 = require("@/utils/response");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/games', async (req, res) => {
    try {
        const games = await Game_1.default.findAll({
            where: { isActive: true },
            order: [['name', 'ASC']],
        });
        res.json(response_1.ApiResponse.success(games, 'Games retrieved successfully'));
    }
    catch (error) {
        console.error('Get games error:', error);
        res.status(500).json(response_1.ApiResponse.error('Internal server error'));
    }
});
exports.default = app;
