import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import Header from "../components/Header";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = async () => {
    try {
      // Check if the email exists in Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        // No sign-in methods mean the email doesn't exist in Firebase
        setErrorMessage(
          <>
            No account found for this email. Would you like to{" "}
            <Link to="/signup" className="text-blue-600 underline">
              sign up
            </Link>
            ?
          </>
        );
      } else {
        // The email exists, so try to sign in and handle wrong password
        try {
          // Set persistence based on "Keep me signed in"
          const persistence = keepSignedIn
            ? browserLocalPersistence
            : browserSessionPersistence;
          await setPersistence(auth, persistence);

          // Attempt to sign in the user
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in successfully.");
        } catch (error) {
          if (error.code === "auth/wrong-password") {
            setErrorMessage("The password you entered is incorrect.");
          } else {
            setErrorMessage(error.message);
          }
        }
      }
    } catch (error) {
      setErrorMessage("Invalid email address.");
      console.error(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const persistence = keepSignedIn
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence); // Set the persistence

      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">
                  Welcome back. We exist to teach you how to cook.
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email
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
                      <div className="flex justify-between">
                        <label
                          className="block text-gray-800 text-sm font-medium mb-1"
                          htmlFor="password"
                        >
                          Password
                        </label>
                      </div>
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
                      <div className="flex justify-between">
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
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                        type="button"
                        onClick={signIn}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </form>

                {errorMessage && (
                  <div className="mt-4 text-red-500 text-center">
                    {errorMessage}
                  </div>
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
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                      <button
                        type="button"
                        className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center"
                      >
                        <svg
                          className="w-4 h-4 fill-current text-white opacity-75 flex-shrink-0 mx-4"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                        </svg>
                        <span
                          onClick={() => signInWithGoogle()}
                          className="flex-auto pl-16 pr-8 -ml-16"
                        >
                          Continue with Google
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-gray-600 text-center mt-6">
                  Don’t you have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignIn;
