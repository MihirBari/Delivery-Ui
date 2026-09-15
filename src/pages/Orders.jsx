import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchOrderDetailApi } from "../services/api";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiPackage,
  FiLayers,
  FiEdit3,
  FiMapPin,
  FiPhone,
  FiCheckSquare,
  FiSquare,
  FiPrinter,
} from "react-icons/fi";

const Orders = () => {
  const [items, setItems] = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { isDemoMode } = useContext(AuthContext);

  useEffect(() => {
    const loadOrderDetail = async () => {
      setLoading(true);
      try {
        const res = await fetchOrderDetailApi(id);
        setItems(res.data || []);
        if (res.order) {
          setOrderMeta(res.order);
        }
      } catch (err) {
        console.error("Error fetching order items:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetail();
  }, [id, isDemoMode]);

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.orderQuantity) || 0), 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isDelivered = orderMeta?.delivery_status === "delivered";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Deliveries
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <FiPrinter className="w-3.5 h-3.5" />
            Print Manifest
          </button>
        </div>
      </div>

      {/* Order Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivery Manifest
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {orderMeta?.order_number || `ORD-${id}`}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {orderMeta?.creditor_name || "Client Order Items"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isDelivered ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <FiCheckCircle className="w-4 h-4" />
                Delivered & Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Out for Delivery
              </span>
            )}
          </div>
        </div>

        {/* Customer & Location Details if available */}
        {orderMeta && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
            <div className="flex items-start gap-2">
              <FiMapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {[
                  orderMeta.creditor_address_1,
                  orderMeta.creditor_address_2,
                  orderMeta.creditor_address_3,
                  orderMeta.creditor_city,
                  orderMeta.creditor_state,
                  orderMeta.creditor_pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            {orderMeta.creditor_number_1 && (
              <div className="flex items-center gap-2 md:justify-end">
                <FiPhone className="w-4 h-4 text-slate-400" />
                <a
                  href={`tel:${orderMeta.creditor_number_1}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {orderMeta.creditor_number_1}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Package Verification Checklist Banner */}
      <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <FiPackage className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Item Checklist:</strong> Verify all physical parcels and quantities before obtaining customer signature.
          </span>
        </div>
        <div className="font-semibold bg-white/80 px-3 py-1 rounded-lg border border-blue-200 self-start sm:self-auto">
          Verified: {checkedCount} / {items.length} items
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-blue-600" />
            Product Line Items ({items.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Total Units: <strong className="text-slate-800">{totalQuantity}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading items manifest...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <FiPackage className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No product items found for this order.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 text-center w-12">Verify</th>
                  <th className="px-4 py-3.5 w-14">#</th>
                  <th className="px-4 py-3.5">Product Description</th>
                  <th className="px-4 py-3.5">HSN Code</th>
                  <th className="px-4 py-3.5">Catalog #</th>
                  <th className="px-4 py-3.5">Unit / Packaging</th>
                  <th className="px-4 py-3.5 text-right font-black">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const isChecked = checkedItems[idx];
                  return (
                    <tr
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? "bg-blue-50/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          className="text-blue-600 focus:outline-none"
                        >
                          {isChecked ? (
                            <FiCheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FiSquare className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Index */}
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 leading-snug">
                          {item.productName || item.Items || "Standard Product"}
                        </div>
                        {item.Items && (
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            Item ID: {item.Items}
                          </div>
                        )}
                      </td>

                      {/* HSN Code */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                          {item.HSNCODE || "-"}
                        </span>
                      </td>

                      {/* Catalog # */}
                      <td className="px-4 py-3.5 text-xs font-mono text-slate-600">
                        {item.Cat || "-"}
                      </td>

                      {/* UOM */}
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                        {item.Test || "Units"}
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3.5 text-right font-black text-slate-900 text-base">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900">
                          {item.orderQuantity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors text-center"
        >
          Back to Orders
        </Link>

        {isDelivered ? (
          <Link
            to={`/challan/${id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
          >
            <FiCheckCircle className="w-4 h-4" />
            View Delivery Receipt
          </Link>
        ) : (
          <Link
            to={`/signature/${id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all"
          >
            <FiEdit3 className="w-4 h-4" />
            Proceed to Customer Signature
          </Link>
        )}
      </div>
    </div>
  );
};

export default Orders;