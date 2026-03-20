from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'pink-scoops-secret-key-2024'

# File paths for data storage
DATA_DIR = 'data'
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')
PRODUCTS_FILE = os.path.join(DATA_DIR, 'products.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# ============ ALL PRODUCTS DATA (40 items) ============
ALL_PRODUCTS = [
    {
        "id": 1,
        "name": "Mango Magic",
        "category": "fruits",
        "rating": 4.9,
        "price": 199,
        "old_price": 279,
        "image": "properties/Mango-Ice-Cream-frt.jpg",
        "description": "Sweet mango with creamy swirl",
        "in_stock": True,
        "toppings": ["Sprinkles", "Chocolate Sauce", "Mango Syrup"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 2,
        "name": "Nutty Caramel Crunch",
        "category": "special",
        "rating": 4.8,
        "price": 249,
        "old_price": 329,
        "image": "properties/nutty spc.jpg",
        "description": "Elegant caramel with roasted nuts",
        "in_stock": True,
        "toppings": ["Caramel Sauce", "Roasted Nuts", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Dip Cone"]
    },
    {
        "id": 3,
        "name": "Belgian Chocolate",
        "category": "creamy",
        "rating": 4.9,
        "price": 219,
        "old_price": 299,
        "image": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
        "description": "Rich Belgian chocolate ice cream",
        "in_stock": True,
        "toppings": ["Chocolate Sauce", "Chocolate Chips", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 4,
        "name": "Oreo Volcano",
        "category": "special",
        "rating": 4.7,
        "price": 239,
        "old_price": 319,
        "image": "properties/oreo spc.jpg",
        "description": "Crushed Oreo with vanilla base",
        "in_stock": True,
        "toppings": ["Oreo Crumbles", "Chocolate Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Dip Cone"]
    },
    {
        "id": 5,
        "name": "Strawberry Swirl",
        "category": "fruits",
        "rating": 4.8,
        "price": 179,
        "old_price": 239,
        "image": "properties/fruit.jpg",
        "description": "Fresh strawberry ice cream",
        "in_stock": True,
        "toppings": ["Strawberry Syrup", "Fresh Strawberries", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 6,
        "name": "Pineapple Paradise",
        "category": "fruits",
        "rating": 4.9,
        "price": 209,
        "old_price": 279,
        "image": "properties/pineapple frt.jpg",
        "description": "Tropical pineapple delight",
        "in_stock": True,
        "toppings": ["Pineapple Sauce", "Coconut Flakes", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 7,
        "name": "Chocolate Truffle",
        "category": "special",
        "rating": 4.8,
        "price": 259,
        "old_price": 339,
        "image": "properties/Chocolate-Fudge-Ice-Cream-cry.webp",
        "description": "Decadent chocolate truffle",
        "in_stock": True,
        "toppings": ["Chocolate Sauce", "Chocolate Truffle Pieces", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 8,
        "name": "Butterscotch Bliss",
        "category": "creamy",
        "rating": 4.7,
        "price": 189,
        "old_price": 249,
        "image": "properties/butterscotch cry.jpg",
        "description": "Rich butterscotch flavor",
        "in_stock": True,
        "toppings": ["Butterscotch Sauce", "Caramel Crunch", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 9,
        "name": "Blueberry Paradise",
        "category": "fruits",
        "rating": 4.6,
        "price": 179,
        "old_price": 239,
        "image": "properties/blue frt.jpg",
        "description": "Sweet blueberry ice cream",
        "in_stock": True,
        "toppings": ["Blueberry Sauce", "Fresh Blueberries", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 10,
        "name": "Vanilla Bean Dream",
        "category": "creamy",
        "rating": 4.8,
        "price": 229,
        "old_price": 299,
        "image": "properties/vanilla cry.webp",
        "description": "Classic vanilla bean",
        "in_stock": True,
        "toppings": ["Chocolate Sauce", "Caramel Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 11,
        "name": "Rainbow Fantasy",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/rainbow spc.jpg",
        "description": "Colorful rainbow ice cream",
        "in_stock": True,
        "toppings": ["Rainbow Sprinkles", "Marshmallow", "Chocolate Sauce"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 12,
        "name": "Lychee",
        "category": "fruits",
        "rating": 4.5,
        "price": 130,
        "old_price": 179,
        "image": "properties/lychee.jpg",
        "description": "Sweet and aromatic lychee",
        "in_stock": True,
        "toppings": ["Lychee Pieces", "Strawberry Syrup", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 13,
        "name": "Caramel Crunch",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/caramel-ice-cry.jpg",
        "description": "Creamy caramel with crunch",
        "in_stock": True,
        "toppings": ["Caramel Sauce", "Crunchy Bits", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 14,
        "name": "Cookies & Cream",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/cookies-and-cream-cry.jpg",
        "description": "Classic cookies and cream",
        "in_stock": True,
        "toppings": ["Cookie Crumbles", "Chocolate Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 15,
        "name": "Chocolate Fudge",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/Chocolate-Fudge-Ice-Cream-cry.webp",
        "description": "Rich chocolate fudge",
        "in_stock": True,
        "toppings": ["Fudge Sauce", "Chocolate Chips", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 16,
        "name": "White Chocolate Cream",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/white-chocolate-cherry-ice-cry.jpg",
        "description": "Smooth white chocolate",
        "in_stock": True,
        "toppings": ["White Chocolate Sauce", "Cherry Pieces", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 17,
        "name": "Tiramisu Treat",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/tiramisu cry.jpg",
        "description": "Coffee-flavored tiramisu",
        "in_stock": True,
        "toppings": ["Coffee Sauce", "Cocoa Powder", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 18,
        "name": "Mocha Madness",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/mocha-ice-cream cry.jpg",
        "description": "Coffee and chocolate fusion",
        "in_stock": True,
        "toppings": ["Mocha Sauce", "Chocolate Chips", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 19,
        "name": "Hazelnut Heaven",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/hazelnut cry.jpg",
        "description": "Creamy hazelnut",
        "in_stock": True,
        "toppings": ["Hazelnut Sauce", "Roasted Hazelnuts", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 20,
        "name": "Almond Cream",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/almond cry.jpg",
        "description": "Rich almond flavor",
        "in_stock": True,
        "toppings": ["Almond Slivers", "Caramel Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 21,
        "name": "Pistachio Royale",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/Pistachio-Ice-Cream-cry.jpg",
        "description": "Premium pistachio",
        "in_stock": True,
        "toppings": ["Pistachio Pieces", "Honey", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 22,
        "name": "Brownie Blast",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/brownie spc.jpg",
        "description": "Brownie pieces in creamy base",
        "in_stock": True,
        "toppings": ["Brownie Bits", "Chocolate Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 23,
        "name": "Red Velvet Fantasy",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/red-velvet-ice-cream spc.jpg",
        "description": "Red velvet cake ice cream",
        "in_stock": True,
        "toppings": ["Cream Cheese", "Red Velvet Crumbs", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 24,
        "name": "Cotton Candy Cloud",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/Cotton-Candy-spc.jpg",
        "description": "Sweet cotton candy",
        "in_stock": True,
        "toppings": ["Cotton Candy Pieces", "Rainbow Sprinkles", "Marshmallow"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 25,
        "name": "Ferrero Fantasy",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/ferrero-rocher-ice-cream spc.jpg",
        "description": "Ferrero Rocher inspired",
        "in_stock": True,
        "toppings": ["Hazelnut Sauce", "Chocolate Pieces", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 26,
        "name": "Rabdi Rich",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/rabdi spc.jpg",
        "description": "Traditional Indian rabdi",
        "in_stock": True,
        "toppings": ["Saffron", "Cardamom", "Pistachio Slivers"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 27,
        "name": "Kesar Pista Supreme",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/kesar-pista-ice-cream spc.png",
        "description": "Saffron and pistachio",
        "in_stock": True,
        "toppings": ["Saffron", "Pistachio Pieces", "Cardamom"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 28,
        "name": "Choco Lava Burst",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/choco lava spc.webp",
        "description": "Chocolate lava explosion",
        "in_stock": True,
        "toppings": ["Hot Fudge", "Chocolate Chips", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 29,
        "name": "Dry Fruit Special",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/dry fruit spv.jpg",
        "description": "Premium dry fruits",
        "in_stock": True,
        "toppings": ["Almonds", "Cashews", "Pistachios", "Raisins"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 30,
        "name": "Cocoa Magic",
        "category": "special",
        "rating": 4.7,
        "price": 150,
        "old_price": 199,
        "image": "properties/cocoa spc.jpg",
        "description": "Rich cocoa flavor",
        "in_stock": True,
        "toppings": ["Cocoa Powder", "Chocolate Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Chocolate Cone"]
    },
    {
        "id": 31,
        "name": "Honeycomb Heaven",
        "category": "creamy",
        "rating": 4.8,
        "price": 160,
        "old_price": 219,
        "image": "properties/honey cry.jpg",
        "description": "Honeycomb bits in creamy base",
        "in_stock": True,
        "toppings": ["Honey", "Honeycomb Pieces", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 32,
        "name": "Kiwi",
        "category": "fruits",
        "rating": 4.5,
        "price": 130,
        "old_price": 179,
        "image": "properties/kiwi frt.jpg",
        "description": "Refreshing kiwi",
        "in_stock": True,
        "toppings": ["Kiwi Pieces", "Strawberry Syrup", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 33,
        "name": "Banana Berry Twist",
        "category": "fruits",
        "rating": 4.9,
        "price": 199,
        "old_price": 269,
        "image": "properties/banana frt.jpg",
        "description": "Banana with berry swirl",
        "in_stock": True,
        "toppings": ["Banana Slices", "Berry Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 34,
        "name": "Lemon Spark",
        "category": "fruits",
        "rating": 4.8,
        "price": 199,
        "old_price": 259,
        "image": "properties/lemon frt.jpg",
        "description": "Zesty lemon flavor",
        "in_stock": True,
        "toppings": ["Lemon Zest", "Lemon Syrup", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 35,
        "name": "Fig & Honey",
        "category": "fruits",
        "rating": 4.7,
        "price": 189,
        "old_price": 249,
        "image": "properties/fig frt.jpg",
        "description": "Sweet fig with honey",
        "in_stock": True,
        "toppings": ["Fig Pieces", "Honey Drizzle", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 36,
        "name": "Kiwi Crush",
        "category": "fruits",
        "rating": 4.6,
        "price": 179,
        "old_price": 239,
        "image": "properties/kiwi frt.jpg",
        "description": "Tangy kiwi crush",
        "in_stock": True,
        "toppings": ["Kiwi Pieces", "Lime Zest", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 37,
        "name": "Pineapple Splash",
        "category": "fruits",
        "rating": 4.8,
        "price": 199,
        "old_price": 269,
        "image": "properties/coconet.frt.jpg",
        "description": "Tropical pineapple splash",
        "in_stock": True,
        "toppings": ["Pineapple Sauce", "Coconut Flakes", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 38,
        "name": "Mixed Fruit Medley",
        "category": "fruits",
        "rating": 4.8,
        "price": 199,
        "old_price": 269,
        "image": "properties/mixed frt.jpg",
        "description": "Assorted fruit flavors",
        "in_stock": True,
        "toppings": ["Mixed Fruit Sauce", "Fresh Fruits", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 39,
        "name": "Passion Fruit Punch",
        "category": "fruits",
        "rating": 4.8,
        "price": 199,
        "old_price": 269,
        "image": "properties/passion frt.jpg",
        "description": "Tangy passion fruit",
        "in_stock": True,
        "toppings": ["Passion Fruit Sauce", "Citrus Zest", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    },
    {
        "id": 40,
        "name": "Sapota Sweet Cream",
        "category": "fruits",
        "rating": 4.8,
        "price": 199,
        "old_price": 269,
        "image": "properties/sapota frt.avif",
        "description": "Creamy sapota delight",
        "in_stock": True,
        "toppings": ["Sapota Pieces", "Caramel Sauce", "Sprinkles"],
        "cones": ["Waffle Cone", "Sugar Cone", "Plain Cone"]
    }
]

def save_data(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def load_data(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return []

def init_data_files():
    if not os.path.exists(PRODUCTS_FILE):
        # Save all 40 products
        save_data(PRODUCTS_FILE, ALL_PRODUCTS)
        print(f"✅ Created products.json with {len(ALL_PRODUCTS)} products")
    else:
        print(f"✅ products.json already exists with {len(load_data(PRODUCTS_FILE))} products")
    
    if not os.path.exists(ORDERS_FILE):
        save_data(ORDERS_FILE, [])
        print("✅ Created orders.json")
    
    if not os.path.exists(USERS_FILE):
        default_users = [
            {
                "id": 1,
                "username": "admin",
                "password": "admin123",
                "email": "admin@pinkscoops.com",
                "role": "admin",
                "full_name": "Admin User",
                "created_at": datetime.now().isoformat()
            }
        ]
        save_data(USERS_FILE, default_users)
        print("✅ Created users.json")

# Login decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session or session['user'].get('role') != 'admin':
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    products = load_data(PRODUCTS_FILE)
    featured_products = products[:4]
    return render_template('index.html', featured_products=featured_products)

@app.route('/menu')
def menu():
    products = load_data(PRODUCTS_FILE)
    print(f"📊 Menu loaded with {len(products)} products")  # Debug print
    return render_template('menu.html', products=products)

@app.route('/order')
def order():
    return render_template('order.html')

@app.route('/favorites')
def favorites():
    return render_template('favorites.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_data(USERS_FILE)
        user = next((u for u in users if u['username'] == username and u['password'] == password), None)
        
        if user:
            session['user'] = {
                'id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'full_name': user['full_name']
            }
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/order-history')
@login_required
def order_history():
    return render_template('order-history.html')

@app.route('/order-success')
def order_success():
    return render_template('order-success.html')

# API Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = load_data(PRODUCTS_FILE)
    return jsonify(products)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_data(PRODUCTS_FILE)
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

@app.route('/api/orders', methods=['POST'])
def create_order():
    order_data = request.json
    orders = load_data(ORDERS_FILE)
    
    new_order = {
        'orderId': f"ORD-{datetime.now().strftime('%Y%m%d')}-{len(orders)+1:04d}",
        'orderDate': datetime.now().isoformat(),
        'customer': order_data.get('customer'),
        'items': order_data.get('items'),
        'pricing': order_data.get('pricing'),
        'status': 'pending'
    }
    
    orders.append(new_order)
    save_data(ORDERS_FILE, orders)
    
    return jsonify(new_order)

@app.route('/api/orders', methods=['GET'])
@admin_required
def get_all_orders():
    orders = load_data(ORDERS_FILE)
    return jsonify(orders)

@app.route('/api/orders/user', methods=['GET'])
@login_required
def get_user_orders():
    orders = load_data(ORDERS_FILE)
    user_orders = [o for o in orders if o['customer'].get('userId') == session['user']['id']]
    return jsonify(user_orders)

# Admin Routes
@app.route('/admin')
@admin_required
def admin_dashboard():
    orders = load_data(ORDERS_FILE)
    products = load_data(PRODUCTS_FILE)
    users = load_data(USERS_FILE)
    
    stats = {
        'total_orders': len(orders),
        'total_revenue': sum(o.get('pricing', {}).get('total', 0) for o in orders),
        'total_products': len(products),
        'total_users': len(users)
    }
    
    recent_orders = orders[-5:] if orders else []
    
    return render_template('admin/dashboard.html', stats=stats, recent_orders=recent_orders)

@app.route('/admin/orders')
@admin_required
def admin_orders():
    orders = load_data(ORDERS_FILE)
    return render_template('admin/orders.html', orders=orders)

@app.route('/admin/products')
@admin_required
def admin_products():
    products = load_data(PRODUCTS_FILE)
    return render_template('admin/products.html', products=products)

@app.route('/admin/products/add', methods=['POST'])
@admin_required
def add_product():
    product_data = request.json
    products = load_data(PRODUCTS_FILE)
    
    new_id = max([p['id'] for p in products], default=0) + 1
    product_data['id'] = new_id
    
    products.append(product_data)
    save_data(PRODUCTS_FILE, products)
    
    return jsonify(product_data)

@app.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product_data = request.json
    products = load_data(PRODUCTS_FILE)
    
    for i, p in enumerate(products):
        if p['id'] == product_id:
            products[i] = {**p, **product_data}
            break
    
    save_data(PRODUCTS_FILE, products)
    return jsonify({'success': True})

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    products = load_data(PRODUCTS_FILE)
    products = [p for p in products if p['id'] != product_id]
    save_data(PRODUCTS_FILE, products)
    return jsonify({'success': True})

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('fullName')
        username = request.form.get('username')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        city = request.form.get('city', '')
        
        users = load_data(USERS_FILE)
        
        # Check if username already exists
        if any(u['username'] == username for u in users):
            return render_template('register.html', error='Username already exists')
        
        # Check if email already exists
        if any(u['email'] == email for u in users):
            return render_template('register.html', error='Email already registered')
        
        # Create new user
        new_user = {
            'id': len(users) + 1,
            'username': username,
            'password': password,  # In production, hash this!
            'email': email,
            'full_name': full_name,
            'phone': phone,
            'city': city,
            'role': 'user',
            'created_at': datetime.now().isoformat()
        }
        
        users.append(new_user)
        save_data(USERS_FILE, users)
        
        return render_template('register.html', success='Account created successfully! Please login.')
    
    return render_template('register.html')    

@app.route('/admin/products/edit/<int:product_id>')
@admin_required
def edit_product(product_id):
    products = load_data(PRODUCTS_FILE)
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return redirect(url_for('admin_products'))
    return render_template('admin/edit_product.html', product_id=product_id)    

@app.route('/admin/orders/<order_id>', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    status = request.json.get('status')
    orders = load_data(ORDERS_FILE)
    
    for order in orders:
        if order['orderId'] == order_id:
            order['status'] = status
            break
    
    save_data(ORDERS_FILE, orders)
    return jsonify({'success': True})

@app.route('/admin/users')
@admin_required
def admin_users():
    users = load_data(USERS_FILE)
    return render_template('admin/users.html', users=users)

if __name__ == '__main__':
    init_data_files()
    app.run(debug=True)