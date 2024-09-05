"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/send", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, generatorInfo } = req.body;
    const message = {
        to: userEmail,
        from: "Vijay Sharma <noreply@shreehps@gmail.com>",
        subject: "Generator Service Due",
        text: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`,
    };
    try {
        const response = yield mail_1.default.send(message);
        res.status(200).json({ success: true, response });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
