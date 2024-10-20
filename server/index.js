const express = require('express');
const app = express();
const port = 3000; 

const edamamApi = require('./edamam');

app.get('/', async (req, res) => {
    const ramenRecipes = await edamamApi.getRecipesByIngredient("ramen");
    let recipe0 = ramenRecipes["hits"][0]["recipe"];
    let recipeName = recipe0["label"]
    res.send("hello");
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from the backend' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


