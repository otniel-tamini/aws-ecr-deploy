import React from "react";
import { Link } from "react-router-dom";
import heroImage from "/assets/job-portal-hero.avif";

const Home = () => (
  <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 pt-24">
    
    {/* Left Section - hidden on small screens */}
    <div className="hidden md:block md:w-1/2">
      <img
        src={heroImage}
        alt="Job Portal"
        className="w-full h-auto object-cover rounded-lg"
      />
    </div>

    {/* Right Section */}
    <div className="md:w-1/2 text-center md:text-left mt-10 md:mt-0 px-4 pr-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
        Find the Right Job <span className="text-red-700">OR</span><br />Hire the Best Talent
      </h1>
      <p className="text-lg text-gray-500 mb-6 text-justify">
        Welcome to our job portal!<br />
        Your one-stop solution for job searching and recruitment.
        Browse curated job listings, post openings, and connect with the right people.
        Designed for ease, speed, and professionalism.
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-start gap-4 justify-center">
        <Link to="/employee/feed">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Explore Jobs
          </button>
        </Link>
        <Link to="/employer/create-job-post">
          <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition duration-300">
            Post a Job
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
