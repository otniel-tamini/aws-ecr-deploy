import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

const Footer = ({bg}) => (
  <footer className={`text-center py-4 ${bg}`}>
    <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-700">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://mahmudalam.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-bold hover:underline transition-all"
        >
          Mahmud Alam
        </a>
        . All rights reserved.
      </p>
      <div className="flex space-x-4 text-gray-700">
        <a
          href="https://www.linkedin.com/in/mahmudalamofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-transform transform hover:scale-110"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://github.com/Mahmud-Alam"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black transition-transform transform hover:scale-110"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://mahmudalam.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-600 transition-transform transform hover:scale-110"
        >
          <FaGlobe size={20} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
