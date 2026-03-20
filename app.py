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

# Initialize data files if they don't exist
def init_data_files():
    if not os.path.exists(PRODUCTS_FILE):
        default_products = [
            {
                "id": 1,
                "name": "Strawberry Bliss",
                "description": "Fresh strawberry ice cream made with real strawberries",
                "price": 159,
                "old_price": 199,
                "rating": 4.8,
                "category": "fruits",
                "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
                "in_stock": True,
                "toppings": ["Sprinkles", "Chocolate Sauce", "Strawberry Syrup"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 2,
                "name": "Rose Petal Dream",
                "description": "Delicate rose flavored ice cream with real rose petals",
                "price": 199,
                "old_price": None,
                "rating": 4.9,
                "category": "special",
                "image": "properties/Rose-Ice-Cream-6-500x500.jpg",
                "in_stock": True,
                "toppings": ["Rose Syrup", "Dried Rose Petals", "Pistachios"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 3,
                "name": "Pink Velvet",
                "description": "Velvety smooth pink ice cream with cream cheese swirls",
                "price": 179,
                "old_price": 199,
                "rating": 4.7,
                "category": "creamy",
                "image": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
                "in_stock": True,
                "toppings": ["Cream Cheese", "Sprinkles", "White Chocolate"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 4,
                "name": "Dragon Fruit",
                "description": "Exotic dragon fruit ice cream with a vibrant pink color",
                "price": 209,
                "old_price": None,
                "rating": 4.6,
                "category": "fruits",
                "image": "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400",
                "in_stock": True,
                "toppings": ["Dragon Fruit Pieces", "Coconut Flakes", "Honey"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 5,
                "name": "Raspberry Ripple",
                "description": "Creamy vanilla with swirls of raspberry sauce",
                "price": 169,
                "old_price": 189,
                "rating": 4.8,
                "category": "fruits",
                "image": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400",
                "in_stock": True,
                "toppings": ["Raspberry Sauce", "Fresh Raspberries", "Sprinkles"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 6,
                "name": "Cotton Candy",
                "description": "Sweet cotton candy flavored ice cream",
                "price": 149,
                "old_price": 169,
                "rating": 4.5,
                "category": "creamy",
                "image": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400",
                "in_stock": True,
                "toppings": ["Cotton Candy Pieces", "Sprinkles", "Chocolate Sauce"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 7,
                "name": "Matcha Pink",
                "description": "Unique blend of matcha and strawberry",
                "price": 189,
                "old_price": 209,
                "rating": 4.7,
                "category": "special",
                "image": "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400",
                "in_stock": True,
                "toppings": ["Matcha Powder", "Strawberry Sauce", "White Chocolate"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            },
            {
                "id": 8,
                "name": "Mango Tango",
                "description": "Tropical mango ice cream with a hint of passion fruit",
                "price": 159,
                "old_price": 179,
                "rating": 4.6,
                "category": "fruits",
                "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
                "in_stock": True,
                "toppings": ["Mango Pieces", "Passion Fruit Sauce", "Sprinkles"],
                "cones": ["Waffle", "Sugar", "Chocolate"]
            }
        ]
        save_data(PRODUCTS_FILE, default_products)
    
    if not os.path.exists(ORDERS_FILE):
        save_data(ORDERS_FILE, [])
    
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

def save_data(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def load_data(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return json.load(f)
    return []

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