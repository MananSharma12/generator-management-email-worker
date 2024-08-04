import { Hono } from 'hono'
import sgMail from '@sendgrid/mail'

type Bindings = {
    SENDGRID_API_KEY: string
}

type HonoEnv = {
    Bindings: Bindings
}

const app = new Hono<HonoEnv>()

app.use('*', async (c, next) => {
    sgMail.setApiKey(c.env.SENDGRID_API_KEY)
    await next()
})

app.post('/send', async (c) => {
    const {userEmail, generatorInfo} = await c.req.json()

    const message = {
        to: userEmail,
        from: "Vijay Sharma <noreply@shreehps@gmail.com>",
        subject: "Generator Service Due",
        text: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`,
    };

    try {
        const response = await sgMail.send(message);
        return c.json({ success: true, message: response }, 200)
    } catch (error) {
        return c.json({ success: false, message: error }, 500)
    }
})

export default app
