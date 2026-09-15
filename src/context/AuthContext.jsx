import React, { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getIsDemoMode, setIsDemoMode } from "../services/api";
import { resetStoredMockOrders } from "../services/mockData";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("asp_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDemoMode, setIsDemoModeState] = useState(getIsDemoMode);
  const navigate = useNavigate();

  useEffect(() => {
    const handleModeChange = () => {
      setIsDemoModeState(getIsDemoMode());
    };
    window.addEventListener("delivery_mode_changed", handleModeChange);
    return () => window.removeEventListener("delivery_mode_changed", handleModeChange);
  }, []);

  const toggleDemoMode = useCallback((forcedVal) => {
    const nextVal = typeof forcedVal === "boolean" ? forcedVal : !getIsDemoMode();
    setIsDemoMode(nextVal);
    setIsDemoModeState(nextVal);
  }, []);

  const login = async (inputs) => {
    const res = await loginApi(inputs);
    if (res && res.data) {
      setCurrentUser(res.data);
      localStorage.setItem("asp_user", JSON.stringify(res.data));
      navigate("/orders");
      return res.data;
    }
    throw new Error("Login failed");
  };

  const loginDemo = async () => {
    toggleDemoMode(true);
    const demoUser = {
      id: 1,
      name: "Rahul Thakur",
      email: "rahul.thakur@alliedscientific.com",
      role: "Senior Delivery Executive",
      assignedVehicle: "KA-05-EV-4211",
    };
    setCurrentUser(demoUser);
    localStorage.setItem("asp_user", JSON.stringify(demoUser));
    navigate("/orders");
    return demoUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("asp_user");
    navigate("/");
  };

  const resetData = () => {
    resetStoredMockOrders();
    window.dispatchEvent(new Event("delivery_orders_updated"));
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("asp_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("asp_user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginDemo,
        logout,
        isDemoMode,
        toggleDemoMode,
        resetData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};