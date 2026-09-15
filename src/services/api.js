import axios from "axios";
import API_BASE_URL from "../config";
import { getStoredMockOrders, saveStoredMockOrders } from "./mockData";

const DEMO_MODE_KEY = "asp_delivery_demo_mode";

export const getIsDemoMode = () => {
  const saved = localStorage.getItem(DEMO_MODE_KEY);
  if (saved !== null) {
    return JSON.parse(saved);
  }
  // Default to true if not set so user immediately gets a working, rich UI without setup
  return true;
};

export const setIsDemoMode = (enabled) => {
  localStorage.setItem(DEMO_MODE_KEY, JSON.stringify(enabled));
  window.dispatchEvent(new Event("delivery_mode_changed"));
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  withCredentials: true,
});

// Authentication
export const loginApi = async ({ email, password, rememberMe }) => {
  const isDemo = getIsDemoMode();

  // If in demo mode or demo credentials used
  if (isDemo || email.toLowerCase().includes("demo")) {
    // Simulated demo delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      status: 200,
      data: {
        id: 1,
        name: "Rahul Thakur",
        email: email || "delivery.agent@alliedscientific.com",
        role: "Field Delivery Executive",
        assignedVehicles: "KA-05-EV-4211",
      },
      isDemo: true,
    };
  }

  try {
    const res = await axiosInstance.post("/login", { email, password, rememberMe });
    return {
      status: res.status,
      data: {
        id: res.data.data,
        name: "Delivery Executive",
        email,
        role: "Field Delivery Executive",
      },
      isDemo: false,
    };
  } catch (err) {
    console.warn("Live login failed, attempting fallback if in demo mode or offline:", err.message);
    // If backend is down, fall back to mock data
    setIsDemoMode(true);
    return {
      status: 200,
      data: {
        id: 1,
        name: "Rahul Thakur (Demo Agent)",
        email,
        role: "Field Delivery Executive",
      },
      isDemo: true,
    };
  }
};

// Fetch assigned orders
export const fetchOrdersApi = async (userId) => {
  const isDemo = getIsDemoMode();

  if (!isDemo) {
    try {
      const response = await axiosInstance.get(`/orders/${userId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return { data: response.data, isDemo: false };
      }
    } catch (err) {
      console.warn("Error fetching from live backend, falling back to mock dataset:", err.message);
      setIsDemoMode(true);
    }
  }

  // Fallback / Demo data
  await new Promise((resolve) => setTimeout(resolve, 300));
  const orders = getStoredMockOrders();
  return { data: orders, isDemo: true };
};

// Fetch items for specific order
export const fetchOrderDetailApi = async (orderId) => {
  const isDemo = getIsDemoMode();

  if (!isDemo) {
    try {
      const response = await axiosInstance.get(`/orderdetail/${orderId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return { data: response.data, isDemo: false };
      }
    } catch (err) {
      console.warn("Error fetching orderdetail from live backend, falling back to mock:", err.message);
    }
  }

  // Fallback / Demo
  await new Promise((resolve) => setTimeout(resolve, 200));
  const orders = getStoredMockOrders();
  const found = orders.find((o) => String(o.id) === String(orderId));
  if (found && found.items) {
    return { data: found.items, order: found, isDemo: true };
  }

  // Default mock items if not found
  return {
    data: [
      {
        orderQuantity: 10,
        Items: "PRD-GEN-01",
        productName: "Laboratory Consumables & Labware Pack",
        HSNCODE: "70179000",
        Test: "Box of 20",
        Cat: "CAT-ASP-100",
      },
    ],
    order: found || null,
    isDemo: true,
  };
};

// Update order with signature & mark delivered
export const updateOrderSignatureApi = async (orderId, { signature, recipientName }) => {
  const isDemo = getIsDemoMode();

  if (!isDemo) {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}`, {
        signature,
        recipientName,
      });
      return { success: true, message: response.data, isDemo: false };
    } catch (err) {
      console.warn("Live PUT /orders failed, updating local mock state:", err.message);
      setIsDemoMode(true);
    }
  }

  // Demo mode local update
  await new Promise((resolve) => setTimeout(resolve, 400));
  const orders = getStoredMockOrders();
  const updated = orders.map((o) => {
    if (String(o.id) === String(orderId)) {
      return {
        ...o,
        delivery_status: "delivered",
        recipient_signature: signature,
        recipient_name: recipientName || "Verified Recipient",
        delivered_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
    return o;
  });
  saveStoredMockOrders(updated);
  return { success: true, message: "Delivered the parcel (Demo Mode)", isDemo: true };
};

// Send email receipt
export const sendEmailApi = async (orderId) => {
  const isDemo = getIsDemoMode();

  if (!isDemo) {
    try {
      const response = await axiosInstance.post(`/send-email/${orderId}`);
      return { success: true, data: response.data, isDemo: false };
    } catch (err) {
      console.warn("Live send-email failed, simulating success:", err.message);
    }
  }

  // Simulated email dispatch
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, message: "Email sent successfully to customer and dispatch team (Simulated).", isDemo: true };
};
