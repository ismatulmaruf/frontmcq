import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { createAccount } from "../Redux/Slices/AuthSlice";
import InputBox from "../Components/InputBox/InputBox";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: null,
    collage: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  async function createNewAccount(event) {
    event.preventDefault();
    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.fullName ||
      !signupData.phone ||
      !signupData.collage
    ) {
      toast.error("Please fill all the details");
      return;
    }

    // checking name field length
    if (signupData.fullName.length < 3) {
      toast.error("Name should be atleast of 3 characters");
      return;
    }
    // checking valid email
    if (!signupData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      toast.error("Invalid email id");
      return;
    }

    // dispatch create account action
    const response = await dispatch(createAccount({ ...signupData }));
    if (response?.payload?.success) {
      setSignupData({
        fullName: "",
        email: "",
        password: "",
        phone: null,
        collage: "",
      });

      navigate("/");
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh] dark:bg-gray-900">
        <form
          onSubmit={createNewAccount}
          autoComplete="off"
          noValidate
          className="flex flex-col  gap-4 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[500px] dark:bg-gray-800 w-full shadow-custom dark:shadow-xl  "
        >
          <h1 className="text-center dark:text-purple-500 text-4xl font-bold font-inter">
            Registration Page
          </h1>
          {/* name */}
          <InputBox
            label={"Name"}
            name={"fullName"}
            type={"text"}
            placeholder={"Enter your name..."}
            onChange={handleUserInput}
            value={signupData.fullName}
          />
          {/* email */}
          <InputBox
            label={"Email"}
            name={"email"}
            type={"email"}
            placeholder={"Enter your email..."}
            onChange={handleUserInput}
            value={signupData.email}
          />
          {/* Phone */}
          <InputBox
            label={"Mobile Number"}
            name={"phone"}
            type={"Number"}
            placeholder={"Enter your Number..."}
            onChange={handleUserInput}
            value={signupData.phone}
          />
          {/* Phone */}
          <InputBox
            label={"Collage Name"}
            name={"collage"}
            type={"text"}
            placeholder={"Enter your Collage..."}
            onChange={handleUserInput}
            value={signupData.collage}
          />
          {/* password */}
          <InputBox
            label={"Password"}
            name={"password"}
            type={"password"}
            placeholder={"Enter your password..."}
            onChange={handleUserInput}
            value={signupData.password}
          />

          {/* submit btn */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-yellow-500 text-white dark:text-base-200 hover:bg-yellow-300 transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500]  text-lg cursor-pointer"
          >
            {isLoading ? "Creating account" : "Create account"}
          </button>

          {/* link */}
          <p className="text-center font-inter text-gray-500 dark:text-slate-300">
            Already have an account ?{" "}
            <Link
              to="/login"
              className="link text-blue-600 font-lato cursor-pointer"
            >
              {" "}
              Login
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}
