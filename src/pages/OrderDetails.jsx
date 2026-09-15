import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchOrdersApi } from "../services/api";
import {
  FiPackage,
  FiSearch,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "delivered"
  const { currentUser, isDemoMode } = useContext(AuthContext);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchOrdersApi(currentUser?.id || 1);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadOrders();

    const handleUpdate = () => loadOrders();
    window.addEventListener("delivery_orders_updated", handleUpdate);
    return () => window.removeEventListener("delivery_orders_updated", handleUpdate);
  }, [loadOrders, isDemoMode]);

  // Derived metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.delivery_status !== "delivered").length;
  const completedCount = orders.filter((o) => o.delivery_status === "delivered").length;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      const isDelivered = order.delivery_status === "delivered";
      if (activeTab === "pending" && isDelivered) return false;
      if (activeTab === "delivered" && !isDelivered) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const name = (order.creditor_name || "").toLowerCase();
      const orderNum = (order.order_number || "").toLowerCase();
      const phone = (order.creditor_number_1 || "").toLowerCase();
      const city = (order.creditor_city || "").toLowerCase();
      const address = (
        (order.creditor_address_1 || "") +
        " " +
        (order.creditor_address_2 || "") +
        " " +
        (order.creditor_address_3 || "")
      ).toLowerCase();

      return (
        name.includes(query) ||
        orderNum.includes(query) ||
        phone.includes(query) ||
        city.includes(query) ||
        address.includes(query)
      );
    });
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiTruck className="w-7 h-7 text-blue-600 shrink-0" />
            Assigned Deliveries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review delivery destinations, contact recipients, and record verified proof of delivery.
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all self-start sm:self-auto"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
          Refresh List
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Assigned
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiPackage className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Pending Delivery
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiClock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Completed Today
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, order #, city, or phone..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "pending"
                ? "bg-white text-amber-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "delivered"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Delivered ({completedCount})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-slate-200 rounded-full" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
              <div className="h-16 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FiPackage className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? `No deliveries matching "${searchQuery}". Try a different keyword.`
              : "No orders are currently available for this filter."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const isDelivered = order.delivery_status === "delivered";
            const fullAddress = [
              order.creditor_address_1,
              order.creditor_address_2,
              order.creditor_address_3,
              order.creditor_city,
              order.creditor_state,
              order.creditor_pincode,
            ]
              .filter(Boolean)
              .join(", ");

            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${order.creditor_name || ""} ${fullAddress}`
            )}`;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md ${
                  isDelivered
                    ? "border-emerald-200 bg-gradient-to-b from-white to-emerald-50/20"
                    : "border-slate-200/90 hover:border-blue-400"
                }`}
              >
                {/* Card Top Header */}
                <div className="p-5 pb-4 border-b border-slate-100 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Order Number Badge */}
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-slate-100 text-slate-800 border border-slate-200">
                      {order.order_number || `#ORD-${order.id}`}
                    </span>

                    {/* Status Badge */}
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-100 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0 border border-blue-200/50">
                      {order.creditor_name ? order.creditor_name.charAt(0) : "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {order.creditor_name || "Valued Client"}
                      </h3>
                      {order.priority && !isDelivered && (
                        <span className="inline-block text-[10px] font-semibold text-rose-600 uppercase tracking-wider mt-0.5">
                          &bull; {order.priority} Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body - Address & Phone Details */}
                <div className="p-5 space-y-3.5 flex-1 text-xs text-slate-600">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <FiMapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="line-clamp-2 text-slate-700 font-medium">
                        {fullAddress || "Address on file"}
                      </p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 mt-1 hover:underline"
                      >
                        Navigate on Google Maps
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Phone number */}
                  {order.creditor_number_1 && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                        Contact:
                      </span>
                      <a
                        href={`tel:${order.creditor_number_1}`}
                        className="font-semibold text-slate-800 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors flex items-center gap-1.5"
                      >
                        <FiPhone className="w-3 h-3 text-blue-600" />
                        {order.creditor_number_1}
                      </a>
                    </div>
                  )}

                  {/* Delivery time info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Assigned: {order.assigned_time || "Today"}</span>
                    {order.delivered_time && (
                      <span className="text-emerald-700 font-medium">
                        Delivered: {order.delivered_time}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                  <Link
                    to={`/orderdetail/${order.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all ${
                      isDelivered
                        ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/20"
                    }`}
                  >
                    {isDelivered ? (
                      <>
                        View Delivered Manifest
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Deliver Parcel & View Items
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;