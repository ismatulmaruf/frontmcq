import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Layout from "../Layout/Layout";
import bkash from "../assets/images/679979bc-c48b-4ed1-b239-b0b2d494b039.png";

const Error = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const searchData = new URLSearchParams(window.location.search);
  const message = searchData.get("message");

  const handleGoHome = () => {
    navigate("/allexamsCatForUser"); // Navigate to the home page
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <img src={bkash} alt="Payment Error" className="w-32 h-auto mb-6" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Payment Error
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            There was an issue with your payment. {message}
          </p>
          <button
            onClick={handleGoHome}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
          >
            Go to Exam
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Error;
