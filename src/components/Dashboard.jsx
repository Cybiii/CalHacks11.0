import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Add this within the component
  
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
      const response = await axios.get("https://api.api-ninjas.com/v1/recipe", {
        headers: {
          "X-Api-Key": "83K5Y0RiBtgPor0HjhqSEw==ZCEwRdwBpbDppPIs",
        },
        params: {
          query: query,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    await fetchRecipes(searchTerm);

    // Scroll down a little after search if recipes are found
    if (recipes.length > 0) {
      window.scrollBy({
        top: 200, // Adjust this value to control how much you scroll
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative pt-24 px-6 bg-[#e4002b] min-h-screen">
      {/* Left wave bar */}
      <div className="absolute top-0 left-0 w-20 h-full bg-wave-pattern bg-cover bg-left animate-waveScroll"></div>
      {/* Right wave bar */}
      <div className="absolute top-0 right-0 w-20 h-full bg-wave-pattern bg-cover bg-right animate-waveScroll"></div>

      {/* Image as a header visual */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center items-center mb-8">
          <img
            className="mx-auto"
            src={"../../public/images/mealprep.png"} // Using the imported image
            width="600"
            alt="logo"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="mt-4 w-1/2 px-4 py-3 bg-[#a3001b] text-white rounded-full text-center"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-[#e4002b]">{error}</p>
      ) : (
        <div className="relative max-w-full overflow-x-auto">
          <div className="flex space-x-6 py-4">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group relative flex-none w-64 cursor-pointer"
                  onClick={() =>
                    navigate(`/recipes/${recipe.title}`, { state: { recipe } })
                  }
                >
                  {/* Recipe Tile */}
                  <div className="p-6 bg-white rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                    {/* Image */}
                    {/* <img
                      src={recipe.image} // Use a placeholder if no image
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded-t-lg mb-4"
                    /> */}
                    <LazyLoadImage
                      src={recipe.image} 
                      alt={recipe.title}
                      width={'100%'}     // Provide width for better layout
                      height={160}      // Provide height for better layout  
                      className="w-full h-40 object-cover rounded-t-lg mb-4" 
                    />
                    <h4 className="text-xl font-bold mb-2">{recipe.title}</h4>
                    <p className="text-gray-600">
                      {recipe.instructions?.slice(0, 50)}...
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center w-full">No recipes found.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};



export default Dashboard;
