import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const UserSubscriptions = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");
  const { catId } = useParams();
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleSubscription = async (userId, action) => {
    const confirmMessage =
      action === "add"
        ? "Are you sure you want to add this subscription?"
        : "Are you sure you want to remove this subscription?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/user/addsubscription/${userId}`,
        {
          method: action === "add" ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            courseId: catId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error ${action === "add" ? "adding" : "removing"} subscription`
        );
      }
      setStatus(`Subscription ${action === "add" ? "added" : "removed"}`);
      fetchUsers(); // Refresh users list to reflect changes
    } catch (error) {
      console.error(
        `Error ${action === "add" ? "adding" : "removing"} subscription:`,
        error
      );
      setStatus("Error");
    }
  };

  // Calculate total subscribed users
  const totalSubscribedUsers = users.filter((user) =>
    user.subscribe.includes(catId)
  ).length;

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto min-h-screen">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          User Subscriptions
        </h1>

        {status && <p className="text-green-500">{status}</p>}

        <p className="mb-4">
          <strong>Total Subscribed Users:</strong> {totalSubscribedUsers}
        </p>
        {loading && (
          <div className="flex justify-center items-center ">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Users List</h2>
          <ul>
            {users?.map((user) => {
              const isSubscribed = user.subscribe.includes(catId);

              return (
                <li
                  key={user._id}
                  className="border-b py-2 flex flex-col sm:flex-row items-start sm:items-center"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p>
                      <strong>ID:</strong> {user._id}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubscription(user._id, "add")}
                      disabled={isSubscribed}
                      className={`py-2 px-4 rounded ${
                        isSubscribed
                          ? "bg-gray-400"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      Add Subscription
                    </button>
                    {role === "ADMIN" && (
                      <button
                        onClick={() => handleSubscription(user._id, "remove")}
                        disabled={!isSubscribed}
                        className={`py-2 px-4 rounded ${
                          !isSubscribed
                            ? "bg-gray-400"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        Remove Subscription
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default UserSubscriptions;
