import { useState, useEffect } from "react";
import { fetchJobs, searchJobs } from "../api/api";

const Feed = () => {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadJobs = async () => {
    const res = await fetchJobs();
    setJobs(res.data);
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      const res = await searchJobs(searchText);
      setJobs(res.data);
    } else {
      loadJobs();
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Job Posts</h2>

      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-2 mb-10">
        <input
          type="text"
          placeholder="Search job..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Job Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
          >
            <h3 className="capitalize text-xl font-semibold text-gray-800 mb-2">
              {job.profile}
            </h3>
            <p className="text-justify text-gray-600 mb-3">{job.desc}</p>
            <p className="text-sm text-gray-700 mb-5">
              <strong>Experience:</strong>{" "}
              {job.exp === 0
                ? "No Experience Required"
                : `${job.exp}+ year${job.exp > 1 ? "s" : ""}`}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.techs.map((tech, i) => (
                <span
                  key={i}
                  className="capitalize bg-blue-100 text-blue-800 text-sm px-3 pt-1 pb-1.5 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
