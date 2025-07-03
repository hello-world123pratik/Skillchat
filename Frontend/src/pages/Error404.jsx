import React from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
      <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-blue-600 hover:underline font-semibold"
      >
        Go back to Home
      </Link>
    </div>
  );
}
