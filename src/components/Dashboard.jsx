import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Separate state for the submitted query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch google images for Ninja API response
  const searchImage = async (query) => {
    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          // api_key: process.env.SERPAPI_API_KEY,
          api_key: "7ecbc898f72aac24a3cf7d84444694019e7e485f7fc6631d5daafa41eac81b47",
          engine: 'google_images',
          q: query,
          num: 1, // Number of results to retrieve
          tbm: 'isch', // search
        },
      });
      return response.data.suggested_searches[0].thumbnail;
    } catch (error){
      return 'https://example.com/default-image.jpg'; 
    }
  };

  // Function to fetch recipes from Ninja API based on the search query
  const fetchRecipes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.api-ninjas.com/v1/recipe', {
        headers: {
          'X-Api-Key': '83K5Y0RiBtgPor0HjhqSEw==ZCEwRdwBpbDppPIs',
        },
        params: {
          query: query, // pass submitted search term
        },
      });

      // response.data[0].image = await searchImages(response.data[0].title);
      // response.data[0].image = "https://serpapi.com/searches/6714da90a775f29102247932/images/b1e7d307ded8964694b968ca766fc29c87d38b0171ce5307e9fd93aacfd9aec0.jpeg";

      // Use Promise.all to handle asynchronous image searches efficiently
      // const imagePromises = response.data.map(recipe => {
      //   return searchImage(recipe.title)
      //     .then(imageUrl => ({ ...recipe, image: imageUrl })); 
      // });

      // // Wait for all image searches to complete
      // const recipesWithImages = await Promise.all(imagePromises);

      // response.data[0].image = searchImage(response.data[0].title);
      // setRecipes(response.data);

      const imageResponse = await axios.get('http://localhost:3001/api/serpapi', {
        params: {
          engine: 'google_images',
          q: 'Sushi',
          num: 1,
          tbm: 'isch'
        }
      });

      response.data[0].image = imageResponse.data.suggested_searches[0].thumbnail;
      
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching recipes");
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    setSearchQuery(searchTerm); // Update the search query to trigger the API call
    fetchRecipes(searchTerm); // Call the API with the search term
  };

  return (
    <section className="relative pt-24 px-6">
      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-8">
        <form onSubmit={handleSubmit}> {/* Form submission will trigger the search */}
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative max-w-full overflow-x-auto">
          <div className="flex space-x-6">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Link
                  to={`/recipes/${recipe.title}`}
                  key={recipe.id}
                  className="group relative flex-none w-64"
                >
                  {/* Recipe Tile */}
                  <div className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                    {/* Image */}
                    <img
                      src={recipe.image} // Use a placeholder if no image
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded-t-lg mb-4"
                    />
                    {/* Name and Description */}
                    <h4 className="text-xl font-bold mb-2">{recipe.title}</h4>
                    <p className="text-gray-600">{recipe.instructions?.slice(0, 50)}...</p> {/* Limit description */}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600 text-center w-full">
                No recipes found.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};



export default Dashboard;
