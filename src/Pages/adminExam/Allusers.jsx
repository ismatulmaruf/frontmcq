import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import ClipLoader from "react-spinners/ClipLoader";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark"); // Example theme state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/user/all`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          // Sort users: Admins and Instructors first, then the rest
          const sortedUsers = data.users.sort((a, b) => {
            if (a.role === "ADMIN") return -1;
            if (b.role === "ADMIN") return 1;
            if (a.role === "INSTRUCTOR") return -1;
            if (b.role === "INSTRUCTOR") return 1;
            return 0;
          });
          setUsers(sortedUsers);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    if (!window.confirm("Are you sure you want to change this user's role?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/${userId}/update-role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(
          users
            .map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
            .sort((a, b) => {
              if (a.role === "ADMIN") return -1;
              if (b.role === "ADMIN") return 1;
              if (a.role === "INSTRUCTOR") return -1;
              if (b.role === "INSTRUCTOR") return 1;
              return 0;
            })
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/${userId}/delete-user`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Count users based on role
  const totalUsers = users.length;
  const totalAdmins = users.filter((user) => user.role === "ADMIN").length;
  const totalInstructors = users.filter(
    (user) => user.role === "INSTRUCTOR"
  ).length;

  return (
    <Layout>
      <div className="container mx-auto min-h-screen p-4 dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-800 ">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader
              color={theme === "dark" ? "#ffffff" : "#000000"}
              size={50}
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total Users: {totalUsers}</p>
              <p className="text-lg font-semibold">
                Total Admins: {totalAdmins}
              </p>
              <p className="text-lg font-semibold">
                Total Instructors: {totalInstructors}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <thead className={`bg-gray-200 dark:bg-gray-700`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-200`}>
                  {users.map((user) => (
                    <tr key={user._id} className={`bg-white dark:bg-gray-900`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRole(user._id, e.target.value)
                          }
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 rounded-md py-1 px-2 dark:border-gray-600 dark:text-gray-200"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                          <option value="INSTRUCTOR">Instructor</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AllUsers;
