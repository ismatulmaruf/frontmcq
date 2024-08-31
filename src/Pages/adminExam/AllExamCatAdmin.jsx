import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link and useNavigate from react-router-dom
import Layout from "../../Layout/Layout";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const AllExamCatAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);
  // console.log(isLoggedIn, role, data);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/category`,
          { credentials: "include" }
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/user/me`,
          { credentials: "include" }
        );
        const data = await response.json();

        setUser(data.user);
        // console.log(user?.subscribe);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCategories();
    fetchUserData();
  }, []);

  return (
    <Layout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        {loading && (
          <div className="flex justify-center items-center ">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            return (
              <div
                key={category._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-32 w-full object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-purple-600">
                  {category.name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {category.details}
                </p>
                <p className="mt-2 font-bold text-gray-800 dark:text-gray-200">
                  Price: BDT {category.price}
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex w-full gap-2">
                    <Link
                      to={`/catAccessDashbord/${category._id}`}
                      className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-red-600 transition-colors mt-4 w-[50%] text-center"
                    >
                      Access Dashboard
                    </Link>
                    <Link
                      to={`/addExam/${category._id}`}
                      className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors mt-4 w-[50%] text-center"
                    >
                      Add Exam
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AllExamCatAdmin;
