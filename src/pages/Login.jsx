import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiTruck, FiLock, FiMail, FiArrowRight, FiZap, FiInfo } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const { login, loginDemo, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to orders dashboard
  useEffect(() => {
    if (currentUser) {
      navigate("/orders");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password) {
      toast.warn("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(inputs);
      toast.success("Welcome back to SwiftDeliver!");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.err ||
          "Unable to connect to server. Use Quick Demo Login to test the app."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      toast.success("Signed in as Demo Delivery Executive!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start demo session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle decorative background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-4 ring-4 ring-white/10">
            <FiTruck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            SwiftDeliver
          </h1>
          <p className="mt-1 text-sm text-slate-400 font-medium">
            Delivery Agent Portal &bull; Allied Scientific
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/20">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Agent Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={inputs.email}
                  onChange={handleChange}
                  placeholder="agent@alliedscientific.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={inputs.password}
                  onChange={handleChange}
                  placeholder="Enter your security password"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {visible ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={inputs.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                Remember me
              </label>
              <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                Help & Support
              </span>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Instant Testing
              </span>
            </div>
          </div>

          {/* Quick Demo Login Button */}
          <div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 active:scale-[0.98] text-sm font-semibold transition-all shadow-sm"
            >
              <FiZap className="w-4 h-4 text-amber-600" />
              1-Click Quick Demo Login
            </button>
          </div>

          {/* Demo info hint */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <FiInfo className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>
              Includes simulated delivery orders, signature capture, and challan email dispatch without needing an active MySQL server.
            </span>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protected delivery agent area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default Login;
