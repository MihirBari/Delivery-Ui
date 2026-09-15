// Initial mock dataset for Delivery App with realistic logistics data
export const INITIAL_MOCK_ORDERS = [
  {
    id: 101,
    order_number: "ASP-2024-8801",
    creditor_name: "Apex Clinical Research Laboratories",
    creditor_number_1: "+91 98450 12890",
    creditor_address_1: "Block B, Tech Park Campus",
    creditor_address_2: "Outer Ring Road, Kadubeesanahalli",
    creditor_address_3: "Opposite Prestige Tech Cloud",
    creditor_city: "Bengaluru",
    creditor_state: "Karnataka",
    creditor_pincode: "560103",
    delivery_status: "raised",
    priority: "High",
    assigned_time: "Today, 09:15 AM",
    items: [
      {
        orderQuantity: 15,
        Items: "PRD-BIO-01",
        productName: "High-Purity Reagent Grade Ethanol 99.9%",
        HSNCODE: "22071000",
        Test: "5 Litre Can",
        Cat: "CAT-ASP-011",
      },
      {
        orderQuantity: 40,
        Items: "PRD-GLS-04",
        productName: "Autoclavable Culture Tubes with Screw Caps",
        HSNCODE: "70179090",
        Test: "Pack of 100",
        Cat: "CAT-ASP-044",
      },
      {
        orderQuantity: 10,
        Items: "PRD-MIC-12",
        productName: "Sterile Membrane Syringe Filters 0.22 um",
        HSNCODE: "84212900",
        Test: "Box of 50",
        Cat: "CAT-ASP-129",
      },
    ],
  },
  {
    id: 102,
    order_number: "ASP-2024-8802",
    creditor_name: "Dr. Sunita Rao (Metropolis Pathology)",
    creditor_number_1: "+91 91234 56789",
    creditor_address_1: "Shop 14, Ground Floor, Royal Arcade",
    creditor_address_2: "80 Feet Road, Indiranagar",
    creditor_address_3: "Near CMH Metro Station",
    creditor_city: "Bengaluru",
    creditor_state: "Karnataka",
    creditor_pincode: "560038",
    delivery_status: "raised",
    priority: "Urgent",
    assigned_time: "Today, 10:45 AM",
    items: [
      {
        orderQuantity: 50,
        Items: "PRD-VAC-02",
        productName: "K2 EDTA Blood Collection Tubes 4ml (Lavender)",
        HSNCODE: "90183990",
        Test: "Tray of 100",
        Cat: "CAT-ASP-202",
      },
      {
        orderQuantity: 20,
        Items: "PRD-PIP-08",
        productName: "Micro-Pipette Tips Low Retention (10-200 uL)",
        HSNCODE: "39269099",
        Test: "Rack of 96",
        Cat: "CAT-ASP-308",
      },
    ],
  },
  {
    id: 103,
    order_number: "ASP-2024-8803",
    creditor_name: "BioGenix Biotech Solutions Pvt Ltd",
    creditor_number_1: "+91 94481 22334",
    creditor_address_1: "Plot 42, Electronic City Phase 1",
    creditor_address_2: "Hosur Road, Keonics Compound",
    creditor_address_3: "Near Wipro Gate 5",
    creditor_city: "Bengaluru",
    creditor_state: "Karnataka",
    creditor_pincode: "560100",
    delivery_status: "raised",
    priority: "Standard",
    assigned_time: "Today, 11:30 AM",
    items: [
      {
        orderQuantity: 5,
        Items: "PRD-AGR-05",
        productName: "Molecular Biology Grade Agarose Powder",
        HSNCODE: "39139090",
        Test: "500 Gram Bottle",
        Cat: "CAT-ASP-505",
      },
      {
        orderQuantity: 8,
        Items: "PRD-BUF-11",
        productName: "Tris-EDTA (TE) Buffer 100X Concentrate",
        HSNCODE: "38220090",
        Test: "1 Litre Bottle",
        Cat: "CAT-ASP-511",
      },
      {
        orderQuantity: 30,
        Items: "PRD-PCR-20",
        productName: "Thin-Wall PCR Tubes 0.2ml Strip of 8",
        HSNCODE: "39269099",
        Test: "Pack of 120",
        Cat: "CAT-ASP-620",
      },
    ],
  },
  {
    id: 104,
    order_number: "ASP-2024-8798",
    creditor_name: "St. John's Medical Research Foundation",
    creditor_number_1: "+91 80220 65000",
    creditor_address_1: "Central Diagnostics Depot, 2nd Floor",
    creditor_address_2: "Sarjapur Road, Koramangala",
    creditor_address_3: "Opposite BDA Complex",
    creditor_city: "Bengaluru",
    creditor_state: "Karnataka",
    creditor_pincode: "560034",
    delivery_status: "delivered",
    priority: "Standard",
    assigned_time: "Yesterday, 03:20 PM",
    delivered_time: "Yesterday, 04:45 PM",
    recipient_name: "Anand Murthy (Store Incharge)",
    items: [
      {
        orderQuantity: 12,
        Items: "PRD-SAN-01",
        productName: "Hospital Grade Surface Disinfectant Solution",
        HSNCODE: "38089400",
        Test: "5 Litre Can",
        Cat: "CAT-ASP-019",
      },
    ],
  },
];

const STORAGE_KEY = "asp_mock_delivery_orders";

export const getStoredMockOrders = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
      return INITIAL_MOCK_ORDERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading mock orders from storage", err);
    return INITIAL_MOCK_ORDERS;
  }
};

export const saveStoredMockOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Error saving mock orders to storage", err);
  }
};

export const resetStoredMockOrders = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
  return INITIAL_MOCK_ORDERS;
};
