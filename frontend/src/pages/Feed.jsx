import { useState, useEffect, useRef } from "react";
import { fetchJobs, searchJobs } from "../api/api";

const Feed = () => {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const jobsPerPage = 6;

  const loadJobs = async () => {
    const res = await fetchJobs();
    setJobs(res.data);
    setCurrentPage(1); // Reset to first page on new load
  };

  const handleSearch = async () => {
    if (searchText.trim()) {
      const res = await searchJobs(searchText);
      setJobs(res.data);
      setCurrentPage(1); // Reset to first page on search
    } else {
      loadJobs();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    loadJobs();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="px-4 py-10 flex flex-col items-center pt-24">
      <h2 className="text-3xl font-bold mb-6">Job Posts</h2>

      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-2 mb-10">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search job..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center flex-wrap gap-2 mt-6 mb-10 w-full max-w-6xl">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Number Buttons */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Job Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentJobs.map((job, index) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center flex-wrap gap-2 mt-10 mb-10 w-full max-w-6xl">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Number Buttons */}
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
