// ======================
// MAIN CONFIGURATION - INDIAN RUPEE VERSION
// ======================

// Global app configuration
const APP_CONFIG = {
    name: 'Pink Scoops',
    version: '1.0.0',
    pricePerScoop: 199, // ₹199 per scoop (was $4.99)
    currency: '₹',
    currencyCode: 'INR',
    maxQuantity: 10,
    minQuantity: 1,
    deliveryThreshold: 999, // Free delivery above ₹999
    deliveryFee: 49, // ₹49 delivery fee
    taxRate: 0.05 // 5% tax
};

// Ice cream data - 10 flavors with images (INR Prices)
const ICE_CREAM_DATA = [
    {
        id: 1,
        name: 'Mango Magic',
        category: 'fruits',
        rating: 4.9,
        price: 199,
        image: 'properties/Mango-Ice-Cream-frt.jpg',
        description: 'Sweet strawberry with cream'
    },
    {
        id: 2,
        name: 'Nutty Caramel crunch',
        category: 'special',
        rating: 4.8,
        price: 249,
        image: 'properties/nutty spc.jpg',
        description: 'Elegant rose flavored gelato'
    },
    {
        id: 3,
        name: 'Belgian Chocolate',
        category: 'creamy',
        rating: 4.9,
        price: 219,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
        description: 'Red velvet cake ice cream'
    },
    {
        id: 4,
        name: 'Oreo Volcano',
        category: 'special',
        rating: 4.7,
        price: 239,
        image: 'properties/oreo spc.jpg',
        description: 'Sakura inspired flavor'
    },
    {
        id: 5,
        name: 'Strawberry Swirl',
        category: 'fruits',
        rating: 4.8,
        price: 179,
        image: 'properties/fruit.jpg',
        description: 'Refreshing dairy-free option'
    },
    {
        id: 6,
        name: 'pineapple Paradise',
        category: 'fruits',
        rating: 4.9,
        price: 209,
        image: 'properties/pineapple frt.jpg',
        description: 'Tangy raspberry swirls'
    },
    {
        id: 7,
        name: 'Chocolate Truffle',
        category: 'special',
        rating: 4.8,
        price: 259,
        image: 'properties/Chocolate-Fudge-Ice-Cream-cry.webp',
        description: 'Exotic pink pitaya'
    },
    {
        id: 8,
        name: 'Butterscotch bliss',
        category: 'creamy',
        rating: 4.7,
        price: 189,
        image: 'properties/butterscotch cry.jpg',
        description: 'Sweet carnival classic'
    },
    {
        id: 9,
        name: 'Blueberry Paradies',
        category: 'fruits',
        rating: 4.6,
        price: 179,
        image: 'properties/blue frt.jpg',
        description: 'Tangy citrus sorbet'
    },
    {
        id: 10,
        name: 'Vanilla Bean Dream',
        category: 'creamy',
        rating: 4.8,
        price: 229,
        image: 'properties/vanilla cry.webp',
        description: 'Classic British flavor'
    },
    {
    id: 11,
    name: "Rainbow Fantasy",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/rainbow spc.jpg"
  },
  {
    id: 12,
    name: "Lychee",
    price: 130,
    rating: 4.5,
    category: "fruits",
    image: "properties/lychee.jpg"
  },
  {
    id: 13,
    name: "Caramel Crunch",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/caramel-ice-cry.jpg"
  },
  {
    id: 14,
    name: "Cookies & Cream",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/cookies-and-cream-cry.jpg"
  },
  {
    id: 15,
    name: "Chocolate Fudge",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/Chocolate-Fudge-Ice-Cream-cry.webp"
  },
  {
    id: 16,
    name: "White Chocolate Cream",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/white-chocolate-cherry-ice-cry.jpg"
  }
  ,
  {
    id: 17,
    name: "Tiramisu Treat",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/tiramisu cry.jpg"
  }
  ,
  {
    id: 18,
    name: "Mocha Madness",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/mocha-ice-cream cry.jpg"
  }
  ,
  {
    id: 19,
    name: "Hazelnut Heaven",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/hazelnut cry.jpg"
  }
  ,
  {
    id: 20,
    name: "Almond Cream",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/almond cry.jpg"
  }
  ,
  {
    id: 21,
    name: "Pistachio Royale",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/Pistachio-Ice-Cream-cry.jpg"
  },
  {
    id: 22,
    name: "Brownie Blast",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/brownie spc.jpg"
  },
  {
    id: 23,
    name: "Red Velvet Fantasy",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/red-velvet-ice-cream spc.jpg"
  },
  {
    id: 24,
    name: "Cotton Candy Cloud",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/Cotton-Candy-spc.jpg"
  },
  {
    id: 25,
    name: "Ferrero Fantasy",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/ferrero-rocher-ice-cream spc.jpg"
  },
  {
    id: 26,
    name: "Rabdi Rich",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/rabdi spc.jpg"
  },
  {
    id: 27,
    name: "Kesar Pista Supreme",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/kesar-pista-ice-cream spc.png"
  },
  {
    id: 28,
    name: "Choco Lava Burst",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/choco lava spc.webp"
  },
  {
    id: 29,
    name: "Dry Fruit Special",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/dry fruit spv.jpg"
  },
  {
    id: 30,
    name: "Cocoa Magic",
    price: 150,
    rating: 4.7,
    category: "special",
    image: "properties/cocoa spc.jpg"
  }
  ,
  {
    id: 31,
    name: "Honeycomb Heaven",
    price: 160,
    rating: 4.8,
    category: "creamy",
    image: "properties/honey cry.jpg"
  },
  {
    id: 32,
    name: "kiwi",
    price: 130,
    rating: 4.5,
    category: "fruits",
    image: "properties/kiwi frt.jpg"
  },
  
  {
    id: 33,
    name: 'Banana Berry Twist',
    category: 'fruits',
    rating: 4.9,
    price: 199,
    image: 'properties/banana frt.jpg',
    description: 'Ripe mangoes with creamy swirl'
  },
  {
    id: 34,
    name: 'Lemon Spark',
    category: 'fruits',
    rating: 4.8,
    price: 199,
    image: 'properties/lemon frt.jpg',
    description: 'Sweet blueberries with creamy base'
  },
  {
    id: 35,
    name: 'fig & Honey',
    category: 'fruits',
    rating: 4.7,
    price: 189,
    image: 'properties/fig frt.jpg',
    description: 'Tropical pineapple flavor with smooth texture'
  },
  {
    id: 36,
    name: 'Kiwi Crush',
    category: 'fruits',
    rating: 4.6,
    price: 179,
    image: 'properties/kiwi frt.jpg',
    description: 'Tangy kiwi ice cream with fresh taste'
  },
  {
    id: 37,
    name: 'Pineapple Splash',
    category: 'fruits',
    rating: 4.8,
    price: 199,
    image: 'properties/coconet.frt.jpg',
    description: 'Sweet lychee with creamy base'
  },
  {
    id: 38,
    name: 'Mixed Fruit Medley',
    category: 'fruits',
    rating: 4.8,
    price: 199,
    image: 'properties/mixed frt.jpg',
    description: 'Sweet lychee with creamy base'
  },
  {
    id: 39,
    name: 'Passion Fruit Punch',
    category: 'fruits',
    rating: 4.8,
    price: 199,
    image: 'properties/passion frt.jpg',
    description: 'Sweet lychee with creamy base'
  },
  {
    id: 40,
    name: 'Sapota Sweet Creame',
    category: 'fruits',
    rating: 4.8,
    price: 199,
    image: 'properties/sapota frt.avif',
    description: 'Sweet lychee with creamy base'
  }
];


// Topping options
const TOPPING_OPTIONS = [
    'Sprinkles',
    'Chocolate Chips', 
    'Strawberry Syrup',
    'Marshmallow',
    'Cookie Crumbles',
    'Caramel Drizzle'
];

// Cone options
const CONE_OPTIONS = [
    'Waffle',
    'Sugar',
    'Plain',
    'Chocolate Dip'
];

// Promo codes (INR discounts)
const PROMO_CODES = {
    'PINK10': 0.10, // 10% off
    'SWEET20': 0.20, // 20% off
    'FREESHIP': 'delivery', // Free delivery
    'WELCOME50': 50, // ₹50 off
    'SUMMER75': 75, // ₹75 off
    'FESTIVE100': 100 // ₹100 off
};

// Utility functions
const Utils = {
    // Format price in Indian Rupees
    formatPrice(amount) {
        // Handle integer prices
        const numAmount = Math.round(amount);
        
        // Format with Indian numbering system (lakhs, crores)
        if (numAmount >= 10000000) { // 1 Crore+
            return `${APP_CONFIG.currency}${(numAmount / 10000000).toFixed(2)}Cr`;
        } else if (numAmount >= 100000) { // 1 Lakh+
            return `${APP_CONFIG.currency}${(numAmount / 100000).toFixed(2)}L`;
        } else {
            // Add commas for thousands (Indian format: 1,00,000)
            return `${APP_CONFIG.currency}${numAmount.toLocaleString('en-IN')}`;
        }
    },
    
    // Format price with decimal for display
    formatPriceWithDecimal(amount) {
        return `${APP_CONFIG.currency}${amount.toFixed(2)}`;
    },
    
    // Generate unique ID
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },
    
    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Local storage helpers
    storage: {
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch {
                return null;
            }
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    }
};

// Make ICE_CREAM_DATA globally available
window.ICE_CREAM_DATA = ICE_CREAM_DATA;
window.APP_CONFIG = APP_CONFIG;
window.TOPPING_OPTIONS = TOPPING_OPTIONS;
window.CONE_OPTIONS = CONE_OPTIONS;
window.PROMO_CODES = PROMO_CODES;
window.Utils = Utils;

console.log('✅ INR Currency System Loaded - ₹199 per scoop');
console.log(ICE_CREAM_DATA);

