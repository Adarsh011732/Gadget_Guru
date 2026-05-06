export const products = [
  {
    id: "p1",
    name: "Apple MacBook Pro 14 (M5 Pro)",
    category: "Laptop",
    basePrice: 179900,
    budgetCategory: "High",
    useCases: ["Developer", "Creative", "Business"],
    priorities: ["Performance", "Display", "Battery"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop",
    overview: "The most advanced 2026 Mac laptop for demanding workflows.",
    specs: { processor: "Apple M5 Pro", ram: "24GB", storage: "1TB SSD", battery: "24 hours" },
    dealScore: 78,
    nextSale: { name: "WWDC Offer", date: "June 10", expectedPrice: 165000 },
    buyAdvice: { status: "neutral", headline: "Brand New Release", description: "Prices will remain stable." },
    storePrices: { 
      amazon: { price: 179900, discounts: ["HDFC: ₹5000 Off"] },
      croma: { price: 181000, discounts: [] }
    }
  },
  {
    id: "p2",
    name: "Samsung Galaxy S26 Ultra",
    category: "Mobile",
    basePrice: 129999,
    budgetCategory: "High",
    useCases: ["Creative", "Business", "Gamer"],
    priorities: ["Camera", "Display", "Performance"],
    image: "https://images.unsplash.com/photo-1678911820864-e4c567cab6a5?w=500&h=400&fit=crop",
    overview: "Ultimate Android flagship with insane AI features.",
    specs: { processor: "Snapdragon 8 Gen 4", ram: "12GB", camera: "200MP + 50MP", battery: "5500mAh" },
    dealScore: 92,
    nextSale: { name: "Amazon Summer Sale", date: "May 15", expectedPrice: 115000 },
    buyAdvice: { status: "buy", headline: "Great Deal", description: "Significant price drop recorded." },
    storePrices: { 
      amazon: { price: 124999, discounts: ["SBI: ₹4000 Off"] },
      flipkart: { price: 129999, discounts: [] }
    }
  },
  {
    id: "p3",
    name: "Sony WH-1000XM6",
    category: "Headphone",
    basePrice: 29990,
    budgetCategory: "Medium",
    useCases: ["Business", "Casual", "Student"],
    priorities: ["Performance", "Battery", "Portability"],
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=400&fit=crop",
    overview: "Industry-leading noise cancellation gets even better.",
    specs: { type: "Over-ear", anc: "Next-Gen QN2", battery: "40 hours", weight: "240g" },
    dealScore: 65,
    nextSale: { name: "Prime Day", date: "July 20", expectedPrice: 24990 },
    buyAdvice: { status: "wait", headline: "Wait for Sale", description: "Usually drops by ₹5000 during sales." },
    storePrices: { 
      amazon: { price: 29990, discounts: [] }
    }
  }
];
