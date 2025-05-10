import { useState } from "react";
import { createJobPost } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [form, setForm] = useState({
    profile: "",
    desc: "",
    exp: "",
    techs: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { profile, desc, exp, techs } = form;

    // Validation
    if (!profile.trim() || !desc.trim() || !exp.trim() || !techs.trim()) {
      alert("All fields are required.");
      return;
    }

    const experience = parseInt(exp);
    if (isNaN(experience) || experience < 0) {
      alert("Experience must be a number greater than or equal to 0.");
      return;
    }

    const newJob = {
      profile: profile.trim(),
      desc: desc.trim(),
      exp: experience,
      techs: techs
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

    await createJobPost(newJob);
    alert("Job post created successfully!");
    navigate("/employee/feed");
  };

  return (
    <div className="flex items-center justify-center px-4 pb-4 pt-24">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Job Post
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">
              Job Title<span className="text-red-700 font-bold">*</span>
            </label>
            <input
              type="text"
              name="profile"
              placeholder="e.g. Frontend Developer"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Job Description<span className="text-red-700 font-bold">*</span>
            </label>
            <textarea
              name="desc"
              rows="4"
              placeholder="Describe the job role and responsibilities"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Experience Required
              <span className="text-red-700 font-bold">*</span> (years)
            </label>
            <input
              type="number"
              name="exp"
              min="0"
              placeholder="e.g. 2"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Technologies<span className="text-red-700 font-bold">*</span>{" "}
              (comma separated)
            </label>
            <input
              type="text"
              name="techs"
              placeholder="e.g. React, Node.js, MongoDB"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
