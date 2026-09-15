import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Link, useParams, useNavigate } from "react-router-dom";
import { updateOrderSignatureApi, fetchOrderDetailApi } from "../services/api";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiEdit3,
  FiRotateCcw,
  FiCheck,
  FiUser,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

const SignatureComponent = () => {
  const signatureRef = useRef(null);
  const containerRef = useRef(null);
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState("");
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMeta, setOrderMeta] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 220 });

  // Measure container for responsive canvas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth || 400;
        setCanvasDimensions({
          width: Math.max(300, Math.min(width - 4, 680)),
          height: 220,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Fetch order summary
  useEffect(() => {
    fetchOrderDetailApi(orderId).then((res) => {
      if (res.order) {
        setOrderMeta(res.order);
        if (res.order.creditor_name) {
          setRecipientName(res.order.creditor_name);
        }
      }
    });
  }, [orderId]);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSignatureEmpty(true);
    }
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current) {
      setIsSignatureEmpty(signatureRef.current.isEmpty());
    }
  };

  const handleSubmit = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Please ask the recipient to provide a signature before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const signatureDataURL = signatureRef.current.toDataURL("image/png");

      // Save proof of delivery via API
      await updateOrderSignatureApi(orderId, {
        signature: signatureDataURL,
        recipientName: recipientName.trim() || orderMeta?.creditor_name || "Authorized Recipient",
      });

      // Save captured signature in sessionStorage so Challan page can preview it immediately
      sessionStorage.setItem(`asp_sig_${orderId}`, signatureDataURL);
      sessionStorage.setItem(`asp_recepient_${orderId}`, recipientName.trim());

      toast.success("Delivery confirmed & signature verified!");
      navigate(`/challan/${orderId}`);
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Failed to submit signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <Link
        to={`/orderdetail/${orderId}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Items Manifest
      </Link>

      {/* Main Proof of Delivery Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Title */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <FiShield className="w-4 h-4" />
            Proof of Delivery (PoD)
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Capture Customer Signature
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order: <strong className="text-slate-800">{orderMeta?.order_number || `#ORD-${orderId}`}</strong> &bull;{" "}
            Customer: <strong className="text-slate-800">{orderMeta?.creditor_name || "Valued Client"}</strong>
          </p>
        </div>

        {/* Recipient Name Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Received By (Recipient Name / Relation)
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FiUser className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma / Store Incharge"
              className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all font-medium"
            />
          </div>
        </div>

        {/* Signature Pad Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Digital Signature Pad
            </label>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              Clear Pad
            </button>
          </div>

          <div
            ref={containerRef}
            className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-colors"
          >
            <SignatureCanvas
              ref={signatureRef}
              penColor="#0f172a"
              canvasProps={{
                width: canvasDimensions.width,
                height: canvasDimensions.height,
                className: "bg-white rounded-xl shadow-inner cursor-crosshair",
              }}
              onEnd={handleSignatureEnd}
            />

            {/* Signature guideline overlay hint */}
            {isSignatureEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
                <FiEdit3 className="w-6 h-6 mb-1 text-slate-300 animate-bounce" />
                <span className="text-xs font-medium">
                  Draw signature here with finger, stylus, or mouse
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Sign inside the framed box. Signee confirms receipt of all intact packages.
          </p>
        </div>

        {/* Verification Check Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            By tapping <strong>Confirm & Complete Delivery</strong>, the delivery status will be marked as Delivered and an electronic delivery receipt will be generated.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to={`/orderdetail/${orderId}`}
            className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 text-center transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSignatureEmpty || isSubmitting}
            className="w-full sm:w-2/3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Recording Proof of Delivery...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                Confirm & Complete Delivery
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureComponent;
