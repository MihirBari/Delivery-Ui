import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Login from "./pages/Login";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import SignatureComponent from "./pages/SignatureComponent";
import Challan from "./pages/Challan";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected delivery agent routes with Layout */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <OrderDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Backward-compatibility route for legacy links /orders/:userId */}
        <Route
          path="/orders/:userId"
          element={<Navigate to="/orders" replace />}
        />
        <Route
          path="/orderdetail/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signature/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SignatureComponent />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challan/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <Challan />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
