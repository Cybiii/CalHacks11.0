import React, { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ recipes }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="relative pt-24 px-6"> {/* Adjust padding to ensure space for fixed header */}
      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Scrollable Tiles */}
      <div className="relative max-w-full overflow-x-auto">
        <div className="flex space-x-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe.name}`}
                key={recipe.id}
                className="group relative flex-none w-64"
              >
                {/* Recipe Tile */}
                <div className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                  {/* Image */}
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                  />
                  {/* Name and Description */}
                  <h4 className="text-xl font-bold mb-2">{recipe.name}</h4>
                  <p className="text-gray-600">{recipe.description}</p>
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
    </section>
  );
};

export default Dashboard;
