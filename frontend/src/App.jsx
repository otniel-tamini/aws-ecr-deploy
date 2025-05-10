import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Feed from "./pages/Feed";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employer/create-job-post" element={<CreatePost />} />
          <Route path="/employee/feed" element={<Feed />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
