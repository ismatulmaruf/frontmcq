import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { ClipLoader } from "react-spinners";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);
  const { catId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true); //
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/exam/all/${catId}`,
          { credentials: "include" }
        );
        const data = await response.json();

        // Sort exams by examNMmbr
        const sortedExams = data.sort((a, b) => a.examNMmbr - b.examNMmbr);

        setExams(sortedExams);
        // setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/user/me`,
          { credentials: "include" }
        );
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchExams();
    fetchUserData();
  }, [catId]);

  const handleBuyExam = (examId) => {
    console.log(`Buy exam: ${examId}`);
    // Implement your purchase logic here
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-800">
          Available Exams
        </h1>
        {loading && (
          <div className="flex justify-center items-center ">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">
                {exam.examNMmbr + ". " + exam.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-2">
                <strong>Description:</strong> {exam.description}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-2">
                <strong>Category:</strong> {exam.category}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-2">
                <strong>Duration:</strong> {exam.time} minutes
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-2">
                <strong>Number of MCQs:</strong> {exam.numberOfMCQs}
              </p>

              <div className="flex space-x-4">
                {user?.role === "ADMIN" ||
                exam.free ||
                user?.subscribe.includes(exam.categoryID) ? (
                  <>
                    <button
                      onClick={() => navigate(`/exam/${catId}/${exam._id}`)}
                      className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-1/2"
                    >
                      Go to Exam
                    </button>
                    {exam.canSeeResult && (
                      <button
                        onClick={() =>
                          navigate(`/results/${exam.categoryID}/${exam._id}`)
                        }
                        className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors w-1/2"
                      >
                        See Result
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleBuyExam(exam._id)}
                    className="bg-green-500 text-white font-bold px-4 py-2 rounded-md hover:bg-green-600 transition-colors w-full"
                  >
                    Buy this Exam
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ExamList;
