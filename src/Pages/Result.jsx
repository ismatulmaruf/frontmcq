import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { ClipLoader } from "react-spinners";
import { FaChevronLeft } from "react-icons/fa";

const Result = () => {
  const { examId, catId } = useParams();
  const [examData, setExamData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch exam data
    const fetchExamData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/exam/withAns/${catId}/${examId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/user/me`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchExamData();
    fetchUserData();
  }, [examId]);

  // if (!examData || !userData) return <div>Loading...</div>;

  if (!examData || !userData)
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      </Layout>
    );

  const userExamResult = userData.examResults.find(
    (result) => result.examId === examId
  );

  return (
    <Layout>
      <div className="result-page min-h-screen  sm:p-8">
        <div className="max-w-full sm:max-w-4xl mx-auto  shadow-lg rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={() => navigate(`/allexamsForUser/${catId}`)}
              className="py-1 px-3 sm:py-2 sm:px-4 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out flex items-center space-x-2"
            >
              <FaChevronLeft />
              <span>Back</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">
              Exam Result
            </h1>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ">
            <span>{examData.title}</span>
          </h2>

          <p className="text-md sm:text-lg font-medium">
            Score:{" "}
            <span className="text-indigo-500">{userExamResult.score}</span> /{" "}
            {examData.numberOfMCQs}
          </p>
          <p className="text-md sm:text-lg font-medium">
            Unanswered:{" "}
            <span className="text-indigo-500">
              {examData.numberOfMCQs -
                Object.keys(userExamResult.submittedAnswers).length}
            </span>
          </p>
          {examData.AddmissionExam ? (
            <p className="text-md sm:text-lg font-medium mb-4 sm:mb-6">
              Incorrect Answer:{" "}
              <span className="text-red-500">
                {userExamResult.incorrectAnswersCount} * 0.25 ={" "}
                {userExamResult.incorrectAnswersCount * 0.25}
              </span>
            </p>
          ) : (
            <p className="text-md sm:text-lg font-medium mb-4 sm:mb-6">
              Incorrect Answer:{" "}
              <span className="text-red-500">
                {userExamResult.incorrectAnswersCount}
              </span>
            </p>
          )}

          <div className="mcqs space-y-4 sm:space-y-6">
            {examData.mcqs.map((mcq, index) => {
              const userAnswer =
                userExamResult.submittedAnswers[mcq._id] || "Unanswered";
              const isCorrect = userAnswer === mcq.correctAnswer;

              return (
                <div
                  key={mcq._id}
                  className="mcq p-3 sm:p-4 dark:bg-gray-800 rounded-lg shadow-md"
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {index + 1}: {mcq.question}
                  </h3>
                  <div className="options space-y-2">
                    {mcq.options.map((option, optionIndex) => {
                      const isOptionCorrect = option === mcq.correctAnswer;
                      const isUserAnswer = userAnswer === option;

                      return (
                        <p
                          key={optionIndex}
                          className={`text-md sm:text-lg font-medium p-2 rounded-md ${
                            isOptionCorrect
                              ? "bg-green-600 text-white"
                              : isUserAnswer
                              ? "bg-red-800 text-white"
                              : "dark:bg-gray-700 dark:text-white text-gray-700"
                          }`}
                        >
                          {option}
                        </p>
                      );
                    })}
                  </div>
                  <p className="text-md sm:text-lg font-medium  mt-4">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-500"
                          : userAnswer === "Unanswered"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    >
                      {userAnswer}
                    </span>
                  </p>
                  <p className="text-md sm:text-lg font-medium ">
                    <strong>Correct Answer:</strong>{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-500 font-bold underline"
                          : "text-blue-500"
                      }
                    >
                      {mcq.correctAnswer}
                    </span>
                  </p>
                  <p className="text-md sm:text-lg font-medium ">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-500"
                          : userAnswer === "Unanswered"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    >
                      {isCorrect
                        ? "Correct"
                        : userAnswer === "Unanswered"
                        ? "Unanswered"
                        : "Wrong"}
                    </span>
                  </p>
                  <p className="text-md sm:text-lg font-medium  mt-4">
                    <strong>Explanation:</strong> {mcq.detailsAnswer}
                  </p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate(`/allexamsForUser/${catId}`)}
            className="w-full mt-4 py-2 sm:py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out flex items-center justify-center space-x-2"
          >
            <span>Go To All Exams</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
