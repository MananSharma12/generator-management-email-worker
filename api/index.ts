import express, {Request, Response} from "express";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const app = express();

app.use(express.json());

interface EmailRequestBody {
    userEmail: string;
    generatorInfo: string;
}

app.post("/send", async (req: Request, res: Response) => {
    const {userEmail, generatorInfo}: EmailRequestBody = req.body;

    const message = {
        to: userEmail,
        from: "Vijay Sharma <noreply@shreehps@gmail.com>",
        subject: "Generator Service Due",
        text: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`,
    };

    try {
        const response = await sgMail.send(message);
        res.status(200).json({success: true, response});
    } catch (error: any) {
        res.status(500).json({success: false, error: error.message});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
