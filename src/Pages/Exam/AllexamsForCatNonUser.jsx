import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
const ExamsList = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/exam/nonUser"
        );
        if (response.ok) {
          const data = await response.json();
          setExams(data);
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Available Exams
          </h1>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <li
                key={exam._id}
                className="rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition transform hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={exam.thumbnail.secure_url}
                  alt={exam.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {exam.title}
                  </h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {exam.description}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Time: {exam.time} minutes
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Price: ${exam.price}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Category: {exam.category}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Number of MCQs: {exam.numberOfMCQs}
                  </p>
                  <p className="text-gray-500 mt-2 dark:text-gray-400">
                    Admission Exam: {exam.AddmissionExam ? "Yes" : "No"}
                  </p>
                  <p
                    className={`mt-4 ${
                      exam.isAccessible ? "text-green-600" : "text-red-600"
                    } dark:${
                      exam.isAccessible ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {exam.isAccessible ? "Accessible" : "Not Accessible"}
                  </p>
                  <div className="mt-4 flex gap-4">
                    {exam.isAccessible ? (
                      <>
                        <a
                          href={`/exam/${exam._id}`}
                          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition-colors w-full text-center"
                        >
                          Give The Exam
                        </a>
                        {exam.canSeeResult && (
                          <a
                            href={`/result/${exam._id}`}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 transition-colors w-full text-center"
                          >
                            See Result
                          </a>
                        )}
                      </>
                    ) : (
                      <button className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 transition-colors">
                        Subscribe or Purchase
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ExamsList;
