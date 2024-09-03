import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Layout from "../Layout/Layout";
import bkash from "../assets/images/679979bc-c48b-4ed1-b239-b0b2d494b039.png"; // Import the image

const Success = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoHome = () => {
    navigate("/allexamsCatForUser"); // Navigate to the home page
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50 dark:bg-gray-900">
        <img
          src={bkash}
          alt="Success"
          className="w-32 h-auto mb-6 filter brightness-100 dark:brightness-75" // Apply brightness adjustments
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
            Success!
          </h1>
          <p className="text-lg text-green-700 dark:text-green-300 mb-6">
            Your payment was completed successfully.
          </p>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-400"
          >
            Go to Exam
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Success;
