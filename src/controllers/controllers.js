const {default:axios} = require("axios");
require("dotenv").config()
const {API_KEY} = process.env;
const {conn, Videogame, Genre} = require("../db.js");


module.exports = {
    getGames: async function(id){
        let rpta;
        let arrayConcat = [];

        try {

            if(id!==undefined){
                try {
                    const info = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
                    return info.data;
                } catch (error) {
                    try {
                        const infoDB = await Videogame.findAll({
                            where:{id:id},
                            include: Genre
                        })
                        console.log(infoDB[0].dataValues)
                        return infoDB[0];
                    } catch (error) {
                        throw new Error(error);
                    }
                    
                }
            }else{
                const info = await axios.get(`https://api.rawg.io/api/games?page=2&page_size=50&key=${API_KEY}`)
                const infoDB = await Videogame.findAll({
                    include: Genre
                });
                rpta = info.data.results;
                arrayConcat = rpta.concat(infoDB);
                arrayConcat = arrayConcat.map((g)=>{
                    let newObj = {
                        id: g.id,
                        name: g.name,
                        released: g.released,
                        image: g.background_image?g.background_image:g.image,
                        rating: g.rating,
                        platforms: g.platforms,
                        genres: g.genres,
                    }
                    return newObj
                })
                    return arrayConcat;
            }

        } catch (error) {
            throw new Error(error);
        }
    },

    getGameByName: async function(name){

        try {
            const info = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
            const infoDB = await Videogame.findAll({
                include: Genre
            });
            const gameSearched = infoDB.filter((g)=>g.dataValues.name.toUpperCase().includes(name.toUpperCase()))
            rpta = info.data.results;
            arrayConcat = gameSearched.concat(rpta);
            
            let arrayAux = arrayConcat.map((g, i)=>{
                if(i < 15){
                    let newObj = {
                        id:g.id,
                        name: g.name,
                        released: g.released,
                        image: g.background_image?g.background_image:g.image,
                        rating: g.rating,
                        platforms: g.platforms,
                        genres: g.genres,
                    }
                    return newObj
                }
            })

            return arrayAux.filter(g => g);
        } catch (error) {
            throw new Error(error);
        }
    },

    getGenres: async function(){
        let arrayAux = [];
        let rpta;

        try {
            rpta = await this.getGames();
            for(let x in rpta){
                if(rpta[x].genres !== undefined){
                    var genreAux = rpta[x].genres;
                }
                for(let y in genreAux){
                    arrayAux.push(genreAux[y].name)
                }
            }
        let finalGenres = [...new Set(arrayAux)];
        return finalGenres;

        } catch (error) {
            return error;
        }
    },

    fillDB: async function(id){
        const genres = await Genre.findAll();
        let genresDB = await Genre.findAll();
        if(genres.length !==0){
            return genres;
        }else {
            let ApiGenres = await this.getGenres();
            if(genresDB.length===0){
                for(let x in ApiGenres){
                    await Genre.create({
                        name:ApiGenres[x]
                    })
                }
            }
            genresDB = await Genre.findAll();
            return genresDB; 
        }
    },
}
