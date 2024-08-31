import Rect, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import { useSelector } from "react-redux";

export default function DisplayMCQ() {
  // const courseDetails = useLocation().state;
  const { id } = useParams();
  const navigate = useNavigate();
  const [mcqs, setMCQs] = useState([]);
  const [currentMCQ, setCurrentMCQ] = useState(0);
  const { role } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle between add and edit modes
  const [editMCQId, setEditMCQId] = useState(null); // To store the MCQ ID being edited
  const [userInput, setUserInput] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    detailsAnswer: "",
  });

  // console.log(userInput);

  useEffect(() => {
    if (!id) {
      navigate("/courses");
    } else {
      fetchMCQs(id);
    }
  }, [id, navigate]);

  async function fetchMCQs(courseId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/courses/${courseId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.ok) {
        setMCQs(result.mcqs);
      } else {
        console.error("Failed to fetch MCQs:", result.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching MCQs:", error);
    }
  }

  async function onMCQDelete(mcqId) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/courses?courseId=${id}&mcqId=${mcqId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.ok) {
        fetchMCQs(id); // Refresh the MCQ list after deletion
      } else {
        console.error("Failed to delete MCQ:", result.message);
      }
    } catch (error) {
      console.error("An error occurred while deleting the MCQ:", error);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleOptionChange(e, index) {
    const newOptions = [...userInput.options];
    newOptions[index] = e.target.value;
    setUserInput({
      ...userInput,
      options: newOptions,
    });
  }

  function addOption() {
    setUserInput({
      ...userInput,
      options: [...userInput.options, ""],
    });
  }

  function handleEditMCQ(mcq) {
    setIsEditing(true);
    setEditMCQId(mcq._id);
    setUserInput({
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
      detailsAnswer: mcq.detailsAnswer,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (
      !userInput.question ||
      !userInput.correctAnswer ||
      !userInput.detailsAnswer ||
      userInput.options.length < 2
    ) {
      toast.error(
        "All fields are mandatory and there must be at least two options"
      );
      return;
    }

    setIsLoading(true);

    const formData = {
      question: userInput.question,
      options: userInput.options,
      correctAnswer: userInput.correctAnswer,
      detailsAnswer: userInput.detailsAnswer,
    };

    try {
      let response;
      if (isEditing) {
        // Update existing MCQ
        response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/courses?courseId=${id}&mcqId=${editMCQId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );
      } else {
        // Add new MCQ
        response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/courses/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mcqs: [formData] }),
            credentials: "include",
          }
        );
      }

      const result = await response.json();

      if (response.ok) {
        if (isEditing) {
          toast.success("MCQ Updated Successfully");
        } else {
          toast.success("MCQ Added Successfully");
        }
        fetchMCQs(id); // Refresh the MCQ list after adding/updating
        setUserInput({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          detailsAnswer: "",
        });
        setIsEditing(false); // Reset editing state
        setEditMCQId(null); // Clear editing ID
      } else {
        toast.error(result.message || "Failed to save MCQ");
      }
    } catch (error) {
      toast.error("An error occurred while saving MCQ");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout hideFooter={true} hideBar={false}>
      <section className="p-6">
        <div>
          <h1 className="text-center text-2xl font-bold ">
            {/* Course: <span>{courseDetails?.title}</span> */}
          </h1>
          <div className="flex flex-col md:flex-row md:justify-between">
            {/* Left section for MCQ details */}
            <div className="md:w-1/2 w-full md:pr-4 border mt-4 rounded mr-4">
              <div className=" p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Question Details</h2>
                <div>
                  <p className="text-lg font-bold">
                    {mcqs[currentMCQ]?.question}
                  </p>
                  <ul className="list-disc pl-5">
                    {mcqs[currentMCQ]?.options.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    <strong>Correct Answer:</strong>{" "}
                    {mcqs[currentMCQ]?.correctAnswer}
                  </p>
                  <p className="mt-2">
                    <strong>Details:</strong> {mcqs[currentMCQ]?.detailsAnswer}
                  </p>
                </div>
                <h2 className="text-xl font-semibold mb-2">MCQ List</h2>
                <ul className="list-none space-y-2">
                  {mcqs.map((mcq, idx) => (
                    <li
                      key={mcq._id}
                      className="flex justify-between items-center p-2 rounded shadow"
                    >
                      <span
                        className={`cursor-pointer ${
                          currentMCQ === idx ? "font-bold " : ""
                        }`}
                        onClick={() => setCurrentMCQ(idx)}
                      >
                        {idx + 1}. {mcq.question}
                      </span>
                      {role === "ADMIN" && (
                        <div>
                          <button
                            onClick={() => handleEditMCQ(mcq)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onMCQDelete(mcq._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Right section for adding/editing MCQ */}
            <div className="md:w-1/2 w-full md:pl-4 mt-4  border rounded">
              <div className="p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  {isEditing ? "Edit MCQ" : "Add New MCQ"}
                </h2>
                <form onSubmit={onFormSubmit}>
                  {/* <InputBox
                    label="Question"
                    name="question"
                    value={userInput.question}
                    onChange={handleInputChange}
                  /> */}
                  <TextArea
                    label={"Question"}
                    name={"question"}
                    rows={3}
                    type={"text"}
                    placeholder={"Enter Mcq question"}
                    onChange={handleInputChange}
                    value={userInput.question}
                  />
                  {userInput.options.map((option, index) => (
                    <div
                      className="flex items-center space-x-4 my-2"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={option}
                        onChange={handleInputChange}
                        disabled={
                          !userInput.options.every((element) => element !== "")
                        }
                        checked={userInput.correctAnswer == option}
                        className="h-5 w-5 text-blue-900 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <InputBox
                        key={index}
                        label={`Option ${index + 1}`}
                        name={`option${index}`}
                        value={option}
                        onChange={(e) => handleOptionChange(e, index)}
                        className="w-full p-2  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="bg-green-500 text-white px-2 py-1 rounded mb-2"
                  >
                    Add Option
                  </button>
                  {/* <InputBox
                    label="Correct Answer"
                    name="correctAnswer"
                    value={userInput.correctAnswer}
                    onChange={handleInputChange}
                  /> */}
                  {/* <InputBox
                    label="Details Answer"
                    name="detailsAnswer"
                    value={userInput.detailsAnswer}
                    onChange={handleInputChange}
                  /> */}
                  <TextArea
                    label={"Details Answer"}
                    name={"detailsAnswer"}
                    rows={3}
                    type={"text"}
                    placeholder={"Enter Mcq detailsAnswer"}
                    onChange={handleInputChange}
                    value={userInput.detailsAnswer}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    disabled={isLoading}
                  >
                    {isEditing ? "Update MCQ" : "Add MCQ"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
