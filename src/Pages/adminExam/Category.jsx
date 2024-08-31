import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

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
      toast.error("Failed to fetch categories. Please try again.");
    }
  };

  // Add or update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/category/${editId}`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/category/`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, details, image }),
      });

      if (response.ok) {
        fetchCategories();
        setName("");
        setPrice("");
        setDetails("");
        setImage("");
        setEditId(null);
        toast.success(`Category ${editId ? "updated" : "added"} successfully!`);
      } else {
        const errorData = await response.json();
        console.error("Error saving category:", errorData);
        toast.error(errorData.message || "Failed to save category.");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category. Please try again.");
    }
  };

  // Set category for editing
  const handleEdit = (category) => {
    setName(category.name);
    setPrice(category.price);
    setDetails(category.details);
    setImage(category.image);
    setEditId(category._id);
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/category/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchCategories();
        toast.success("Category deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);
        toast.error(errorData.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  return (
    <Layout hideFooter>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Category Manager
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Existing categories */}
          <div className="flex-1">
            <ul className="space-y-4">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 rounded-md dark:bg-gray-800"
                >
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h2 className="text-lg text-black dark:text-white">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Price: BDT {category.price}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {category.details}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-700 transition dark:text-blue-400 dark:hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-700 transition dark:text-red-400 dark:hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Update form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category Name"
                  className="px-4 py-2 border rounded-md focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-black"
                  required
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="px-4 py-2 border rounded-md focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-black"
                  required
                />
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Details"
                  className="px-4 py-2 border rounded-md focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-black"
                  required
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="px-4 py-2 border rounded-md focus:outline-none bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-black"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {editId ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryManager;
