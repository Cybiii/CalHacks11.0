import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Bookmarks from "./Bookmarks"; // Import Bookmarks component
import FilledBookmarkIcon from "./FilledBookmarkIcon";
import EmptyBookmarkIcon from "./EmptyBookmarkIcon";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const bookmarksRef = collection(db, "users", currentUser.uid, "bookmarks");

    const unsubscribe = onSnapshot(bookmarksRef, (snapshot) => {
      const bookmarksData = snapshot.docs.map((doc) => ({
        recipeId: doc.data().id,
        docId: doc.id,
      }));
      setBookmarkedRecipes(bookmarksData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const fetchRecipes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.api-ninjas.com/v1/recipe",
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_NINJA_API_KEY,
          },
          params: {
            query: query,
          },
        }
      );

      const recipesWithId = response.data.map((recipe) => ({
        ...recipe,
        id: recipe.title.replace(/\s+/g, "-").toLowerCase(),
      }));

      setRecipes(recipesWithId);
      setLoading(false);
    } catch (error) {
      setError("Error fetching recipes");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecipes(searchTerm);
  };

  const handleBookmark = async (recipe) => {
    try {
      const bookmarksRef = collection(
        db,
        "users",
        currentUser.uid,
        "bookmarks"
      );

      const existingBookmark = bookmarkedRecipes.find(
        (bookmark) => bookmark.recipeId === recipe.id
      );

      if (existingBookmark) {
        // Remove the bookmark
        const bookmarkDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "bookmarks",
          existingBookmark.docId
        );
        await deleteDoc(bookmarkDocRef);
        alert("Bookmark removed!");
      } else {
        // Add the bookmark
        await addDoc(bookmarksRef, recipe);
        alert("Recipe bookmarked!");
      }
    } catch (error) {
      console.error("Error handling bookmark: ", error);
      alert("Error handling bookmark.");
    }
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
        <>
          <div className="relative max-w-full overflow-x-auto">
            <div className="flex space-x-6">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="group relative flex-none w-64 cursor-pointer"
                    onClick={() =>
                      navigate(`/recipes/${recipe.title}`, {
                        state: { recipe },
                      })
                    }
                  >
                    <div className="p-6 bg-white rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 h-96 flex flex-col justify-between">
                      <img
                        src={recipe.image || "placeholder-image.jpg"}
                        alt={recipe.title}
                        className="w-full h-40 object-cover rounded-t-3xl mb-4"
                      />
                      <h4 className="text-xl font-bold mb-2">
                        {recipe.title}
                      </h4>
                      <p className="text-gray-600">
                        {recipe.instructions?.slice(0, 50)}...
                      </p>
                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(recipe);
                        }}
                        className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                        aria-label={
                          bookmarkedRecipes.some(
                            (bookmark) => bookmark.recipeId === recipe.id
                          )
                            ? "Remove bookmark"
                            : "Add bookmark"
                        }
                      >
                        {bookmarkedRecipes.some(
                          (bookmark) => bookmark.recipeId === recipe.id
                        ) ? (
                          <FilledBookmarkIcon />
                        ) : (
                          <EmptyBookmarkIcon />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center w-full">
                  No recipes found.
                </p>
              )}
            </div>
          </div>
          {/* Include Bookmarks component */}
          <Bookmarks />
        </>
      )}
    </section>
  );
};

export default Dashboard;
