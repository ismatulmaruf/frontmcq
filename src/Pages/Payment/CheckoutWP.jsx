import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import bkashLogo from "../../assets/images/679979bc-c48b-4ed1-b239-b0b2d494b039.png"; // Adjust the path to your image

const CheckoutWP = () => {
  const { price, examname } = useParams(); // Extracting route parameters

  // Function to create WhatsApp URL
  const createWhatsAppURL = () => {
    const phoneNumber = "+8801824178167";
    const message = `I have made the payment of BDT ${price} via Bkash for the exam '${decodeURIComponent(
      examname
    )}'.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
          <div className="flex justify-center mb-4">
            <img
              src={bkashLogo}
              alt="Bkash Logo"
              className="w-32 h-auto" // Adjust the size as needed
            />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Checkout for Exam
          </h1>
          <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
            Price: BDT {price}
          </p>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Exam Name: {decodeURIComponent(examname)}
          </p>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Please follow these steps:
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              <strong>Send money</strong> of BDT {price} to Bkash number:{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                01519178167
              </strong>
              .
            </li>
            <li>
              After completing the payment, click the button below to send a
              message on WhatsApp with your Bkash transaction details and Exam
              name.
            </li>
          </ul>
          <a
            href={createWhatsAppURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-4 px-6 py-3 bg-green-600 text-white rounded shadow-md hover:bg-green-700 transition duration-300"
          >
            Send Message on WhatsApp
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutWP;
