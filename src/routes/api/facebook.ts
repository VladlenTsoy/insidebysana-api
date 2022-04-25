import express from "express"
import FacebookController from "controllers/staff/facebook/FacebookController"

const router = express.Router()

router.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(500);
})

router.post("/webhook", FacebookController.Webhook)

router.get("/chats", FacebookController.GetAll)
router.get("/chat/:id/messages", FacebookController.GetMessages)
router.post("/chat/:id/message", FacebookController.SendMessage)

export default router
