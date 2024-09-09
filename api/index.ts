import { VercelRequest, VercelResponse } from "@vercel/node";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailRequestBody {
    userEmail: string;
    generatorInfo: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userEmail, generatorInfo }: EmailRequestBody = req.body;

    const message = {
        to: userEmail,
        from: "Vijay Sharma <noreply@shreehps@gmail.com>",
        subject: "Generator Service Due",
        text: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`,
    };

    try {
        const response = await sgMail.send(message);
        return res.status(200).json({ success: true, response });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
