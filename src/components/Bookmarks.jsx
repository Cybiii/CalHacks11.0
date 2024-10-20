import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FilledBookmarkIcon from "./FilledBookmarkIcon";

const Bookmarks = () => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const bookmarksRef = collection(db, "users", currentUser.uid, "bookmarks");
    const q = query(bookmarksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookmarksData = snapshot.docs.map((doc) => ({
        id: doc.data().id, // Recipe ID
        docId: doc.id, // Firestore document ID
        ...doc.data(),
      }));
      setBookmarks(bookmarksData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteBookmark = async (docId) => {
    if (!currentUser) return;

    try {
      const bookmarkDocRef = doc(
        db,
        "users",
        currentUser.uid,
        "bookmarks",
        docId
      );
      await deleteDoc(bookmarkDocRef);
    } catch (error) {
      console.error("Error deleting bookmark: ", error);
      alert("Error deleting bookmark.");
    }
  };

  if (!currentUser) {
    return <p>Please sign in to view your bookmarks.</p>;
  }

  return (
    <div className="bookmarks my-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Your Bookmarked Recipes
      </h2>
      {bookmarks.length === 0 ? (
        <p className="text-white">You haven't bookmarked any recipes yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group relative flex-none w-64 cursor-pointer"
              onClick={() =>
                navigate(`/recipes/${bookmark.title}`, {
                  state: { recipe: bookmark },
                })
              }
            >
              <div className="p-6 bg-white rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 h-96 flex flex-col justify-between">
                <img
                  src={bookmark.image || "placeholder-image.jpg"}
                  alt={bookmark.title}
                  className="w-full h-40 object-cover rounded-t-3xl mb-4"
                />
                <h4 className="text-xl font-bold mb-2">{bookmark.title}</h4>
                <p className="text-gray-600 line-clamp-3">
                  {bookmark.instructions}
                </p>
                {/* Delete Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBookmark(bookmark.docId); // Use docId here
                  }}
                  className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none self-start"
                  aria-label="Remove bookmark"
                  title="Remove bookmark"
                >
                  <FilledBookmarkIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
