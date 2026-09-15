import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button
      onClick={logout}
      title="Log out of delivery portal"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
    >
      <FiLogOut className="w-3.5 h-3.5" />
      <span>Log Out</span>
    </button>
  );
};

export default Logout;