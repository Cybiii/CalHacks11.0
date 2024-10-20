import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.api-ninjas.com/v1/recipe', {
        headers: {
          'X-Api-Key': '83K5Y0RiBtgPor0HjhqSEw==ZCEwRdwBpbDppPIs',
        },
        params: {
          query: query,
        },
      });
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching recipes");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    fetchRecipes(searchTerm);
  };

  return (
    <section className="relative pt-24 px-6 bg-[#e4002b] min-h-screen">
      {/* Search Bar */}
      <div className="max-w-lg mx-auto pt-20 mb-8">
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
            className="mt-4 w-1/4 px-4 py-3 bg-[#a3001b] text-white rounded-full text-center"
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
          <div className="flex space-x-6">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Link
                  to={`/recipes/${recipe.title}`}
                  key={recipe.id}
                  className="group relative flex-none w-64"
                >
                  {/* Recipe Tile */}
                  <div className="p-6 bg-white rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                    {/* Image */}
                    <img
                      src={recipe.image || 'placeholder-image.jpg'}
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded-t-3xl mb-4"
                    />
                    {/* Name and Description */}
                    <h4 className="text-xl font-bold mb-2">{recipe.title}</h4>
                    <p className="text-gray-600">{recipe.instructions?.slice(0, 50)}...</p>
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
