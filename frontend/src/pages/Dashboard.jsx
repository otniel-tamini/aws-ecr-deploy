import { useEffect, useState } from "react";
import { fetchJobs } from "../api/api";

const techKeywords = [
  "java",
  "python",
  "javascript",
  "typescript",
  "c#",
  "c++",
  "go",
  "ruby",
  "php",
  "react",
  "angular",
  "vue",
  "node",
  "django",
  "flask",
  "spring",
  "kotlin",
  "swift",
  "solidity",
  "blockchain",
  "tensorflow",
  "pytorch",
  "nextjs",
  "express",
  "mongodb",
  "mysql",
  "hadoop",
  "spark",
  "graphql",
  "DataScientist",
  "DataEngineer",
  "DataAnalyst",
  "MachineLearning",
  "DevOps",
  "Cloud",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Agile",
];

const roleKeywords = [
  "developer",
  "engineer",
  "scientist",
  "manager",
  "lead",
  "junior",
  "senior",
  "expert",
  "consultant",
  "architect",
  "intern",
  "specialist",
  "test",
  "job",
];

const Dashboard = () => {
  const [techCount, setTechCount] = useState({});

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetchJobs();
        const jobs = res.data;

        const counts = {};

        jobs.forEach((job) => {
          const title = (job.profile || "").toLowerCase();
          let matched = false;

          techKeywords.forEach((tech) => {
            if (title.includes(tech.toLowerCase())) {
              const techFormatted = formatTechName(tech);
              counts[techFormatted] = (counts[techFormatted] || 0) + 1;
              matched = true;
            }
          });

          if (!matched) {
            counts["Others"] = (counts["Others"] || 0) + 1;
          }
        });

        setTechCount(counts);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    loadJobs();
  }, []);

  const formatTechName = (word) => {
    if (word === "c#") return "C#";
    if (word === "c++") return "C++";
    if (word === "js" || word === "javascript") return "JavaScript";
    if (word === "ts" || word === "typescript") return "TypeScript";
    if (word === "node") return "Node.js";
    if (word === "nextjs") return "Next.js";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Technology-wise Job Count (Accurate)
        </h2>

        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">Technology</th>
              <th className="p-3 border">Job Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(techCount)
              .sort((a, b) => {
                if (a[0] === "Others") return 1;
                if (b[0] === "Others") return -1;
                return b[1] - a[1];
              })
              .map(([tech, count]) => (
                <tr key={tech} className="hover:bg-gray-50">
                  <td className="p-3 border">{tech}</td>
                  <td className="p-3 border">{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
