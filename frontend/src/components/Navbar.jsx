import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`z-50 fixed top-0 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-primary"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span
            className={`text-xl font-bold hidden sm:block ${
              scrolled ? "text-blue-600" : "text-sky-900"
            }`}
          >
            Job Portal
          </span>
        </Link>

        <div className="space-x-4">
          <Link
            to="/employee/feed"
            className={`font-medium ${
              scrolled ? "text-blue-600" : "text-sky-900"
            } hover:text-orange-400 transition-colors`}
          >
            <span className="hidden sm:inline">Job </span>Feed
          </Link>
          <Link
            to="/employer/create-job-post"
            className={`font-medium ${
              scrolled ? "text-blue-600" : "text-sky-900"
            } hover:text-orange-400 transition-colors`}
          >
            Create Job
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
