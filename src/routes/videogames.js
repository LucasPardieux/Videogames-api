const { Router } = require ("express");
const controller = require("../controllers/controllers.js")
const router = Router();
const {Videogame} = require("../db.js");


router.get("/", async (req,res,next) => {
    const {name} = req.query;
    let videogame
    try {
        if(name === undefined){
            videogame = await controller.getGames();
        }else{
            videogame = await controller.getGameByName(name);
        }
        res.status(200).send(videogame);
    } catch (error) {
        res.status(400).send("Error al obtener los videojuegos")
    }
})

router.post("/", (req,res,next) =>{
    let {name, description, released, rating, image, genres, platforms} = req.body;
    console.log(image)
    if(!image)image="https://res.cloudinary.com/lmn/image/upload/e_sharpen:100/f_auto,fl_lossy,q_auto/v1/gameskinnyop/d/7/d/orig_d7dec62511f8a78172d019fbbbb66e36.jpg"
    Videogame.create({
        name, description, released, rating, image, platforms
    })
    .then(game =>{
        game.addGenre(genres);
        res.status(201).send(game);
    })
    .catch (error=>{
            res.status(400).send({error:"Game was not created."})
        })
})
module.exports = router;