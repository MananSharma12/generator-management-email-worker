import {Hono} from 'hono'

type Bindings = {
    SENDGRID_API_KEY: string
}

type HonoEnv = {
    Bindings: Bindings
}

const app = new Hono<HonoEnv>()

app.post('/send-email', async (c) => {
    const {userEmail, generatorInfo} = await c.req.json()

    const message = {
        personalizations: [{to: [{email: userEmail}]}],
        from: {email: 'noreply@shreehps.gmail.com', name: 'Vijay Sharma'},
        subject: 'Generator Service Due',
        content: [
            {
                type: 'text/plain',
                value: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`
            }
        ]
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })

        if (!response.ok) {
            throw new Error(`SendGrid API responded with status ${response.status}`)
        }

        return c.json({success: true, message: 'Email sent successfully'}, 200)
    } catch (error) {
        return c.json({success: false, message: 'Failed to send email notification'}, 500)
    }
})

export default app
