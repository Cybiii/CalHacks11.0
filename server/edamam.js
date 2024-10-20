require('dotenv').config()

const axios = require('axios'); // Or your preferred HTTP client

const APP_ID = process.env.EDAMAM_APP_ID; // Replace with your actual Edamam App ID
const APP_KEY = process.env.EDAMAM_API; // Replace with your actual Edamam App Key
apiKey: process.env.VITE_GROQ_API_KEY
const apiUrl = 'https://api.edamam.com/api/recipes/v2';

async function getRecipesByIngredient(ingredient) {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        type: 'public',
        q: ingredient, // Search query (ingredient)
        app_id: APP_ID,
        app_key: APP_KEY,
        from: 0,
        to: 5
      },
    });

    // Access the response data:
    const recipes = response.data.hits; 

    // Example: Print the first recipe's name and URL
    console.log("First recipe:", recipes[0].recipe.label);
    console.log("Recipe URL:", recipes[0].recipe.url);

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}


module.exports = {getRecipesByIngredient};