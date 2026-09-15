// API configuration with environment variable support and sensible fallbacks
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:9000"
    : "https://delivery-ch0u.onrender.com");

export default API_BASE_URL;
