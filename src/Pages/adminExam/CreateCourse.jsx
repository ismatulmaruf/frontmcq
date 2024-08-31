import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import { useSelector } from "react-redux";

export default function CreateExam() {
  const { catId } = useParams();
  // console.log(catId);
  const navigate = useNavigate();

  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  // console.log(isLoggedIn, role, data);

  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility
  const [userInput, setUserInput] = useState({
    title: "",
    examNMmbr: 0,
    description: "",
    time: 0,
  });

  const [exams, setExams] = useState([]);

  const [isChecked, setIsChecked] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editExamId, setEditExamId] = useState(null);
  const [createdBy, setCreatedBy] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const handleCheckboxChange = () => setIsChecked(!isChecked);
  const handleFreeCheckboxChange = () => setIsFree(!isFree);

  useEffect(() => {
    const selectedId = categories.find((category) => category._id === catId);
    setSelectedCategory(selectedId?.name);
    setSelectedCategoryId(selectedId?._id);
  }, [categories]); //

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/category`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchExams();
    setCreatedBy(data.email);
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/courses/withId/${catId}`
      );
      const data = await response.json();
      if (data.success) {
        const sortedExams = data.exams.sort(
          (a, b) => a.examNMmbr - b.examNMmbr
        );

        setExams(sortedExams);
      } else {
        toast.error("Failed to fetch exams.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching exams.");
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !userInput.title ||
      !userInput.examNMmbr ||
      !userInput.description ||
      !userInput.time
    ) {
      toast.error("All fields are required!");
      return;
    }

    setIsCreatingExam(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/courses${
          editMode ? `/${editExamId}` : ""
        }`,
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...userInput,
            AddmissionExam: isChecked,
            free: isFree,
            createdBy: createdBy,
            category: selectedCategory,
            categoryID: selectedCategoryId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchExams(); // Refresh the exam list
        setUserInput({
          title: "",
          examNMmbr: 0,
          description: "",
          time: 0,
        });
        setIsChecked(false);
        setIsFree(false);
        toast.success(`Exam ${editMode ? "updated" : "created"} successfully!`);
        setEditMode(false);
        setEditExamId(null);
        setIsModalOpen(false); // Close the modal after submission
      } else {
        toast.error(data.message || "Failed to save the exam.");
      }
    } catch (error) {
      toast.error("An error occurred while saving the exam.");
    } finally {
      setIsCreatingExam(false);
    }
  };

  const handleEdit = (exam) => {
    setEditMode(true);
    setEditExamId(exam._id);
    setUserInput({
      title: exam.title,
      examNMmbr: exam.examNMmbr,
      description: exam.description,
      time: exam.time,
    });
    setIsChecked(exam.AddmissionExam);
    setIsFree(exam.free);
    setCreatedBy(exam.createdBy);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/courses/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          fetchExams(); // Refresh the exam list
          toast.success("Exam deleted successfully!");
        } else {
          toast.error("Failed to delete the exam.");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the exam.");
      }
    }
  };

  return (
    <Layout>
      <section className=" py-8 px-5 min-h-[100vh]">
        {/* Left Column: Existing Exams */}
        <div className="">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-center dark:text-purple-500 text-4xl font-bold font-inter">
              Existing Exams
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-5 py-2    rounded-lg hover:bg-green-600 transition-colors"
            >
              Create New Exam
            </button>
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <li
                key={exam._id}
                className="flex flex-col justify-between bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-xl text-purple-600">
                    {exam.examNMmbr + ". " + exam.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {exam.description}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <p>
                      <span className="font-semibold">Time :</span> {exam.time}{" "}
                      minutes
                    </p>
                    <p>
                      <span className="font-semibold">Instructor :</span>{" "}
                      {exam.createdBy}
                    </p>
                    <p>
                      <span className="font-semibold">Category :</span>{" "}
                      {exam.category}
                    </p>
                    <p>
                      <span className="font-semibold">Type :</span>{" "}
                      {exam.AddmissionExam ? "Admission Exam" : "Regular Exam"}
                    </p>
                    <p>{exam.free ? "Free" : "Paid"}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {(role == "ADMIN" || exam.createdBy == data.email) && (
                    <>
                      <button
                        onClick={() => handleEdit(exam)}
                        className="bg-green-700 font-bold text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="bg-orange-700 font-bold text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => navigate(`/addexam/mcqAdd/${exam._id}`)}
                        className="bg-teal-700 text-white px-5 py-2 font-bold rounded-lg shadow-md hover:bg-teal-600 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1"
                      >
                        Add Mcq
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Modal for Create/Edit Exam */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full md:w-[48%]">
              <h1 className="text-center dark:text-purple-500 text-xl font-bold font-inter">
                {editMode ? "Edit Exam" : "Create New Exam"}
              </h1>
              <form
                onSubmit={onFormSubmit}
                autoComplete="off"
                noValidate
                className="flex flex-col gap-6 mt-6"
              >
                <InputBox
                  label={"Title"}
                  name={"title"}
                  type={"text"}
                  placeholder={"Enter Exam Title"}
                  onChange={handleUserInput}
                  value={userInput.title}
                />
                <InputBox
                  label={"Time"}
                  name={"time"}
                  type={"number"}
                  placeholder={"Enter Exam Time"}
                  onChange={handleUserInput}
                  value={userInput.time}
                />
                <InputBox
                  label={"No"}
                  name={"examNMmbr"}
                  type={"number"}
                  placeholder={"Enter Exam Number"}
                  onChange={handleUserInput}
                  value={userInput.examNMmbr}
                />

                <TextArea
                  label={"Description"}
                  name={"description"}
                  rows={3}
                  type={"text"}
                  placeholder={"Enter Exam Description"}
                  onChange={handleUserInput}
                  value={userInput.description}
                />

                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/3 px-2 mt-3 flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <span className="font-bold">Admission Exam</span>
                    </label>
                  </div>
                  <div className="w-full md:w-1/3 px-2 mt-3 flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                        checked={isFree}
                        onChange={handleFreeCheckboxChange}
                      />
                      <span className="font-bold">Free</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    disabled={isCreatingExam}
                  >
                    {editMode ? "Update Exam" : "Create Exam"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
