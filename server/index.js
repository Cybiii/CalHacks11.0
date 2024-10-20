const express = require('express');
const app = express();
const port = 3000; 

const edamamApi = require('./edamam');
const { default: axios } = require('axios');
const { castToError } = require('groq-sdk/core');

function helperParseRecipe(targetRecipe){
    return({
        "label": targetRecipe.label,
        "image": targetRecipe.image,
        "source": targetRecipe.source,
        "url": targetRecipe.url,
        "healthLabels": targetRecipe.healthLabels,
    });
}

app.get('/', async (req, res) => {
    res.send('welcome to the index.js');
});

app.get('/api/ninjas/:food', async (req, res) =>{

});

app.get('/api/edamam/:food', async (req, res) => {
    const recipes = await edamamApi.getRecipesByName(req.params.food);
    console.log(recipes); 

    if (recipes.length > 0){
        let recipe = recipes[0].recipe;
        let allRecipes = [];

        // add all recipes, parse to simple form using helper function
        for (let i = 0; i < recipe.length; i++){
            allRecipes.push(helperParseRecipe(recipe[i]));
            let recipeName = recipe[i].label
        }
        console.log(allRecipes);
        res.send();
    }
    else{
        res.send("Error: Edamam Request did not receive any input");
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


