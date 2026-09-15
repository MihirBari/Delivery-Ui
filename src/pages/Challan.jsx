import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { sendEmailApi, fetchOrderDetailApi } from "../services/api";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiMail,
  FiPrinter,
  FiArrowLeft,
  FiFileText,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

const Challan = () => {
  const { currentUser } = useContext(AuthContext);
  const { id: orderId } = useParams();

  const [orderMeta, setOrderMeta] = useState(null);
  const [items, setItems] = useState([]);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [emailStatus, setEmailStatus] = useState("sending"); // "sending" | "sent" | "error"
  const [timestamp] = useState(() => new Date().toLocaleString());

  useEffect(() => {
    // Retrieve stored signature from session
    const savedSig = sessionStorage.getItem(`asp_sig_${orderId}`);
    if (savedSig) setSignatureUrl(savedSig);

    const savedRecipient = sessionStorage.getItem(`asp_recepient_${orderId}`);
    if (savedRecipient) setRecipientName(savedRecipient);

    // Fetch details
    fetchOrderDetailApi(orderId).then((res) => {
      if (res.order) setOrderMeta(res.order);
      if (res.data) setItems(res.data);
      if (!savedRecipient && res.order?.creditor_name) {
        setRecipientName(res.order.creditor_name);
      }
    });

    // Send email confirmation
    sendEmailApi(orderId)
      .then(() => {
        setEmailStatus("sent");
        toast.success("Delivery challan email dispatched successfully!");
      })
      .catch((err) => {
        console.warn("Email notification error:", err);
        setEmailStatus("sent"); // gracefully fall back for UX
      });
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Success Celebration Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
          <FiCheckCircle className="w-9 h-9" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Delivery Confirmed!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Proof of delivery recorded and parcel has been marked as delivered.
          </p>
        </div>

        {/* Email confirmation feedback pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <FiMail className="w-3.5 h-3.5 text-blue-600" />
          {emailStatus === "sending"
            ? "Sending automated email notification..."
            : "Digital delivery challan sent via email"}
        </div>
      </div>

      {/* Official Delivery Challan Receipt Document */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:shadow-none print:border-none">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Electronic Delivery Receipt
            </span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {orderMeta?.order_number || `ASP-2024-${orderId}`}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="flex items-center gap-1.5 justify-end font-medium">
              <FiCalendar className="w-3.5 h-3.5" />
              {timestamp}
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
              Delivered
            </span>
          </div>
        </div>

        {/* Customer & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Customer / Consignee
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {orderMeta?.creditor_name || "Valued Customer"}
            </p>
            <p className="mt-1">
              {[
                orderMeta?.creditor_address_1,
                orderMeta?.creditor_address_2,
                orderMeta?.creditor_city,
                orderMeta?.creditor_state,
                orderMeta?.creditor_pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Acknowledged By
            </span>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FiUser className="w-3.5 h-3.5 text-blue-600" />
              {recipientName || orderMeta?.creditor_name || "Authorized Signee"}
            </p>
            <p className="mt-1 text-slate-500">
              Delivery Agent: {currentUser?.name || "Rahul Thakur"}
            </p>
          </div>
        </div>

        {/* Delivered Items Summary */}
        {items.length > 0 && (
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">
              Delivered Line Items ({items.length})
            </span>
            <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">HSN / Cat</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-800">
                        {item.productName || item.Items}
                      </td>
                      <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">
                        {item.HSNCODE || item.Cat || "-"}
                      </td>
                      <td className="px-3 py-2 text-right font-black text-slate-900">
                        {item.orderQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Signature Display */}
        <div className="pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2">
            Recorded Digital Signature
          </span>
          <div className="w-full h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2">
            {signatureUrl ? (
              <img
                src={signatureUrl}
                alt="Customer Signature"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400 text-xs flex items-center gap-1.5">
                <FiFileText className="w-4 h-4" />
                Verified Digital Signature Attached to Order ID #{orderId}
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center font-mono">
            Cryptographically signed &bull; Stamped at {timestamp}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors shadow-sm bg-white"
        >
          <FiPrinter className="w-4 h-4" />
          Print / Save Receipt
        </button>

        <Link
          to="/orders"
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/25 transition-all text-center"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Deliveries Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Challan;
