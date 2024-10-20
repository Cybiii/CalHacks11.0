import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Separate state for the submitted query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch google images using Pexels API
  async function pexelSearchPhotos(query) {
    try{
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`,{
            headers: {
                Authorization: "bV8EomxUZBoaninBow7lKNbzqPreK2V6b4UN2O9VPzYQwKLoOzHV61XX"
            }
        });

        if(!response.ok){
            throw new Error(`Pexels API error ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;

    }catch(error){
        console.error('Error fetching photos: ', error);
    }};


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
      

      // For each photo, call Pexel search photos
      for (let i = 0; i < response.data.length; i++){
        pexelSearchPhotos(response.data[i].title)
        .then(photos => {
          response.data[i].image = photos.photos[0].src.tiny;
          console.log("LOADED PHOTO::", photos.photos[0].src.tiny);

        }).catch(error => {
          console.error("Error fetching photos from Pexels:", error);
        });
      }

      

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
