// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import InputBox from "../../Components/InputBox/InputBox";
// import Layout from "../../Layout/Layout";
// import { AiOutlineArrowLeft } from "react-icons/ai";

// export default function AddMCQ({ setAdd }) {
//   const courseDetails = useLocation().state;
//   // console.log(courseDetails);
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [userInput, setUserInput] = useState({
//     question: "",
//     options: ["", ""],
//     correctAnswer: "",
//     detailsAnswer: "",
//   });

//   function handleInputChange(e) {
//     const { name, value } = e.target;
//     setUserInput({
//       ...userInput,
//       [name]: value,
//     });
//   }

//   function handleOptionChange(e, index) {
//     const newOptions = [...userInput.options];
//     newOptions[index] = e.target.value;
//     setUserInput({
//       ...userInput,
//       options: newOptions,
//     });
//   }

//   function addOption() {
//     setUserInput({
//       ...userInput,
//       options: [...userInput.options, ""],
//     });
//   }

//   async function onFormSubmit(e) {
//     e.preventDefault();

//     if (
//       !userInput.question ||
//       !userInput.correctAnswer ||
//       !userInput.detailsAnswer || // Check for detailsAnswer
//       userInput.options.length < 2
//     ) {
//       toast.error(
//         "All fields are mandatory and there must be at least two options"
//       );
//       return;
//     }

//     setIsLoading(true);

//     const formData = {
//       mcqs: [
//         {
//           question: userInput.question,
//           options: userInput.options,
//           correctAnswer: userInput.correctAnswer,
//           detailsAnswer: userInput.detailsAnswer, // Include detailsAnswer
//         },
//       ],
//     };

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_REACT_APP_API_URL}/courses/${
//           courseDetails._id
//         }`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//           credentials: "include",
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         toast.success("MCQ Added Successfully");
//         setAdd("addd");
//         setUserInput({
//           question: "",
//           options: ["", ""], // Reset options to two empty strings
//           correctAnswer: "",
//           detailsAnswer: "", // Reset detailsAnswer
//         });
//       } else {
//         toast.error(result.message || "Failed to add MCQ");
//       }
//     } catch (error) {
//       toast.error("An error occurred while adding MCQ");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!courseDetails) navigate("/courses");
//   }, [courseDetails, navigate]);

//   return (
//     <Layout hideNav hideFooter>
//       <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
//         <form
//           onSubmit={onFormSubmit}
//           autoComplete="off"
//           noValidate
//           className="flex flex-col dark:bg-base-100 gap-7 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[750px] w-full shadow-custom dark:shadow-xl"
//         >
//           <header className="flex items-center justify-center relative">
//             <button
//               className="absolute left-2 text-xl text-green-500"
//               onClick={() => navigate(-1)}
//             >
//               <AiOutlineArrowLeft />
//             </button>
//             <h1 className="text-center dark:text-purple-500 md:text-4xl text-2xl font-bold font-inter">
//               Add new MCQ
//             </h1>
//           </header>
//           <div className="w-full flex md:flex-row md:justify-between justify-center flex-col md:gap-0 gap-5">
//             <div className="md:w-[100%] w-full flex flex-col gap-5">
//               {/* Question */}
//               <InputBox
//                 label={"Question"}
//                 name={"question"}
//                 type={"text"}
//                 placeholder={"Enter MCQ Question"}
//                 onChange={handleInputChange}
//                 value={userInput.question}
//               />
//               {/* Options */}
//               {userInput.options.map((option, index) => (
//                 <InputBox
//                   key={index}
//                   label={`Option ${index + 1}`}
//                   name={`option${index + 1}`}
//                   type={"text"}
//                   placeholder={`Enter Option ${index + 1}`}
//                   onChange={(e) => handleOptionChange(e, index)}
//                   value={option}
//                 />
//               ))}
//               <button
//                 type="button"
//                 onClick={addOption}
//                 className="mt-3 bg-green-500 text-white transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer"
//               >
//                 Add Another Option
//               </button>
//               {/* Correct Answer */}
//               <InputBox
//                 label={"Correct Answer"}
//                 name={"correctAnswer"}
//                 type={"text"}
//                 placeholder={"Enter Correct Answer"}
//                 onChange={handleInputChange}
//                 value={userInput.correctAnswer}
//               />
//               {/* Details Answer */}
//               <InputBox
//                 label={"Details Answer"}
//                 name={"detailsAnswer"}
//                 type={"text"}
//                 placeholder={"Enter Details Answer"}
//                 onChange={handleInputChange}
//                 value={userInput.detailsAnswer}
//               />
//             </div>
//           </div>

//           {/* submit btn */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="mt-3 bg-yellow-500 text-white dark:text-base-200 transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer"
//           >
//             {isLoading ? "Adding MCQ..." : "Add New MCQ"}
//           </button>
//         </form>
//       </section>
//     </Layout>
//   );
// }
