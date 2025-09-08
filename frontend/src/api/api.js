import axios from 'axios';

// Prefer Vite env at build time, fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const fetchJobs = () => axios.get(`${API_BASE}/job-posts`);

export const searchJobs = (text) => axios.get(`${API_BASE}/job-posts/${text}`);

export const createJobPost = (job) => axios.post(`${API_BASE}/create-job-post`, job);
