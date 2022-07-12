const { Router } = require ("express");
const controller = require("../controllers/controllers.js")
const router = Router();

router.get("/", async (req,res,next) => {
    try {
        const genre = await controller.fillDB();
        res.status(200).send(genre)
    } catch (error) {
        res.sendStatus(400)
    }
})



module.exports = router;