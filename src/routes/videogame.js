const { Router } = require ("express");
const controller = require("../controllers/controllers.js")
const router = Router();




router.get("/:idVideogame", async (req,res,next) =>{
    const {idVideogame} = req.params;
    try {
        let info = await controller.getGames(idVideogame);
        res.status(200).send(info);
    } catch (error) {
        res.status(400).send({error:"video game was not found"})
    }
})


module.exports = router;