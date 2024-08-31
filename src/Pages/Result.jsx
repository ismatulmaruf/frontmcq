import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";

const Result = () => {
  const { examId, catId } = useParams();
  const [examData, setExamData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch exam data
    const fetchExamData = async () => {
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

  if (!examData || !userData) return <div>Loading...</div>;

  const userExamResult = userData.examResults.find(
    (result) => result.examId === examId
  );

  return (
    <Layout>
      <div className="result-page min-h-screen p-4 sm:p-8">
        <div className="max-w-full sm:max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-4 sm:mb-6">
            Exam Result
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            {examData.title}
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
                  className="mcq p-3 sm:p-4 bg-gray-100 rounded-lg shadow-md"
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
                              ? "bg-green-200 text-green-800"
                              : isUserAnswer
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {option}
                        </p>
                      );
                    })}
                  </div>
                  <p className="text-md sm:text-lg font-medium text-gray-600 mt-4">
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
                  <p className="text-md sm:text-lg font-medium text-gray-600">
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
                  <p className="text-md sm:text-lg font-medium text-gray-600">
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
                  <p className="text-md sm:text-lg font-medium text-gray-600 mt-4">
                    <strong>Explanation:</strong> {mcq.detailsAnswer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;
