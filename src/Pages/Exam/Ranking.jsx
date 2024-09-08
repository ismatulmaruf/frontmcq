import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get examId from URL parameters
import Layout from "../../Layout/Layout";
import ClipLoader from "react-spinners/ClipLoader"; // To show a loader

const Ranking = () => {
  const { examId } = useParams(); // Extract examId from URL parameters
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark"); // Example theme state

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/exam/ranking/${examId}`,
          { credentials: "include" }
        );

        if (response.status === 404) {
          // Handle 404 specifically when no users have submitted results
          const data = await response.json();
          setError(data.message); // Set the message from the backend (e.g., "No one has submitted the exam results yet.")
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch rankings.");
        }

        const data = await response.json();
        setRankings(data); // Set the rankings data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [examId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <ClipLoader
            color={theme === "dark" ? "#ffffff" : "#000000"}
            size={50}
          />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-xl font-semibold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-xl font-semibold mb-4">Ranking</h1>
        {rankings.length === 0 ? (
          <p>No rankings available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Mark
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rankings.map((user, index) => (
                  <tr key={index} className="bg-white dark:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.totalMark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Ranking;
