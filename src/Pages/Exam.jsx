import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

const ExamPage = () => {
  const { examId, catId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [timeLeft, setTimeLeft] = useState(null); // State to manage the timer

  useEffect(() => {
    // Fetch the exam details from the backend
    const fetchExam = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/exam/${catId}/${examId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setExam(data);
          setTimeLeft(data.time * 60);
        } else {
          console.error("Failed to fetch exam");
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    // Timer countdown logic
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleSubmit(); // Auto-submit the exam when time runs out
    }
  }, [timeLeft]);

  const handleAnswerChange = (mcqId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [mcqId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // console.log(answers);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/exam/${catId}/${examId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ answers }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // console.log(result);
        // alert(`Your score: ${result.score}/${result.totalQuestions}`);
        navigate(`/results/${catId}/${examId}`);
      } else {
        console.error("Failed to submit exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="exam-page  min-h-screen p-8">
        <div className="max-w-4xl mx-auto  shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
            {exam.title}
          </h1>
          <h2 className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 text-xl font-semibold py-2 px-4 rounded-full shadow-lg z-50">
            Time Left: {formatTime(timeLeft)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {exam.mcqs.map((mcq) => (
              <div key={mcq._id} className="mcq p-4  rounded-lg shadow-md">
                <p className="text-xl font-semibold  mb-4">{mcq.question}</p>
                {mcq.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`mcq-${mcq._id}`}
                        value={option}
                        onChange={(e) =>
                          handleAnswerChange(mcq._id, e.target.value)
                        }
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="  text-lg">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 mt-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition duration-200"
            >
              Submit Exam
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ExamPage;
