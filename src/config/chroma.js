import { ChromaClient } from "chromadb";
import { SentenceTransformer } from 'sentence-transformers';

const client = new ChromaClient({ path: "http://localhost:5173" }); // Adjust path as necessary
const collection = await client.createCollection({ name: "recipes" });

// Load the model
const model = new SentenceTransformer('all-MiniLM-L6-v2');

async function embedRecipe(text) {
    const embeddings = await model.encode([text]);
    return embeddings[0]; // Return the first embedding
}

const recipes = [
  // Your recipe objects here
];

// Function to add recipes to the collection
async function addRecipesToCollection() {
    for (const recipe of recipes) {
        const embedding = await embedRecipe(recipe.description);
        await collection.add({
            ids: [recipe.id.toString()],
            embeddings: [embedding],
            documents: [recipe.description],
            metadatas: [{
                name: recipe.name,
                ingredients: recipe.ingredients,
                description: recipe.description,
            }],
        });
    }
}

// Example of querying for similar recipes based on user input
async function findSimilarRecipes(userInput) {
    const userInputEmbedding = await embedRecipe(userInput); // Embed user input
    const results = await collection.query({
        queryEmbeddings: [userInputEmbedding],
        nResults: 5, // Return the top 5 similar recipes
    });
    console.log('Similar Recipes:', results);
}

// Start the process
await addRecipesToCollection();
const userInput = "I want a dish with tomato and pasta."; // User input
await findSimilarRecipes(userInput);
