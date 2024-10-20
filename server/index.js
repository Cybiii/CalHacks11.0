const express = require('express');
const app = express();
const port = 3000; 

const edamamApi = require('./edamam');
const { default: axios } = require('axios');

app.get('/', async (req, res) => {
    res.send('welcome to the index.js');
});

app.get('/api/edamam', async (req, res) => {
    const ramenRecipes = await edamamApi.getRecipesByIngredient(req);
    console.log(ramenRecipes); 

    if (ramenRecipes.length > 0){
        let recipe = ramenRecipes[0].recipe
        let recipeName = recipe.label;
        let recipeImage = recipe.image;
        res.send(`
            <div>
                <h1>recipe name: ${recipeName}</h1>
                <img src="${recipeImage}" alt="${recipeName}"></img>
            </div>
        `);
    }
    else{
        res.send("Error: Edamam Request did not receive any input");
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


