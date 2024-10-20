import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext"; // Use the global auth context
import { Button } from "@radix-ui/themes";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // For the custom username
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  const signUp = async () => {
    try {
      // Set persistence based on the "Keep me signed in" checkbox
      const persistence = keepSignedIn
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set the display name (username) for the newly created user
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      console.log(
        "User signed up and profile updated with username:",
        username
      );
    } catch (err) {
      console.error("Error signing up:", err.message);
      setErrorMessage(err.message); // Display error to the user
    }
  };

  const signInWithGoogle = async () => {
    try {
      const persistence = keepSignedIn
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);

      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Error signing in with Google:", err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Site header */}
      <Header />

      {/* Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {currentUser ? (
              <>
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                  {/* Page header */}
                  <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                    <h1 className="h1">You are now logged in!</h1>
                    <p className="flex mt-4 justify-center items-center gap-2">
                      Navigate to{" "}
                      <Link to="/">
                        <Button variant="solid">Home</Button>
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Page header */}
                <div className="max-w-3xl mx-auto text-center pb-2 md:pb-10">
                  <h1 className="h1">
                    Welcome to <span className="text-red-600">MealPrep!</span>
                  </h1>
                  <h2 className="h3">
                    Sign up for the <span className="text-red-600">AI cooking assistant</span> today!
                  </h2>
                </div>

                {/* Form */}
                <div className="max-w-sm mx-auto">
                  <form>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-800 text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          Username <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="form-input w-full text-gray-800"
                          placeholder="Enter your username"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-800 text-sm font-medium mb-1"
                          htmlFor="email"
                        >
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="form-input w-full text-gray-800"
                          placeholder="Enter your email address"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-800 text-sm font-medium mb-1"
                          htmlFor="password"
                        >
                          Password <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="password"
                          type="password"
                          className="form-input w-full text-gray-800"
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={keepSignedIn}
                            onChange={(e) => setKeepSignedIn(e.target.checked)}
                          />
                          <span className="text-gray-600 ml-2">
                            Keep me signed in
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mt-6">
                      <div className="w-full px-3">
                        <button
                          className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                          type="button"
                          onClick={() => signUp()}
                        >
                          Sign up
                        </button>
                      </div>
                    </div>
                  </form>
                  {errorMessage && (
                    <div className="mt-4 text-red-500">{errorMessage}</div>
                  )}

                  <div className="flex items-center my-6">
                    <div
                      className="border-t border-gray-300 flex-grow mr-3"
                      aria-hidden="true"
                    ></div>
                    <div className="text-gray-600 italic">Or</div>
                    <div
                      className="border-t border-gray-300 flex-grow ml-3"
                      aria-hidden="true"
                    ></div>
                  </div>
                  <form>
                    <div className="flex flex-wrap -mx-3 mb-3">
                      <div className="w-full px-3">
                        <button
                          className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center"
                          type="button"
                          onClick={signInWithGoogle}
                        >
                          <svg
                            className="w-4 h-4 fill-current text-white opacity-75 flex-shrink-0 mx-4"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                          </svg>
                          <span className="flex-auto pl-16 pr-8 -ml-16">
                            Continue with Google
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
