const products = [
    {
        id: 1,
        name: "Leather Bag",
        price: 2999,
        category: "bags",
        img: "bag.jpg",
        description: "Handcrafted premium leather bag with spacious compartments. Perfect for daily use or professional settings.",
        features: ["Genuine leather", "Multiple compartments", "Adjustable strap", "Water-resistant", "Lifetime warranty"]
    },
    {
        id: 2,
        name: "Leather Wallet",
        price: 1499,
        category: "wallets",
        img: "wallet.jpg",
        description: "Slim and elegant leather wallet designed to fit all your essentials without the bulk.",
        features: ["Premium leather", "6 card slots", "2 bill compartments", "RFID protection", "Compact design"]
    },
    {
        id: 3,
        name: "Leather Belt",
        price: 999,
        category: "belts",
        img: "belt.jpg",
        description: "Classic leather belt with reversible design and durable metal buckle.",
        features: ["Full-grain leather", "Reversible design", "Metal buckle", "Multiple sizes", "Scratch-resistant"]
    },
    {
        id: 4,
        name: "Leather Shoes",
        price: 3999,
        category: "shoes",
        img: "shoes.jpg",
        description: "Elegant handcrafted leather shoes combining comfort and style for any occasion.",
        features: ["Handcrafted leather", "Cushioned sole", "Breathable lining", "Non-slip grip", "Available in multiple sizes"]
    }
];

function renderProducts(list) {
    let c = document.getElementById("productList");
    if (!c) return;
    c.innerHTML = "";
    list.forEach(p => {
        c.innerHTML += `
      <div class="col-md-3">
        <div class="card mb-4">
          <img src="images/${p.img}" alt="${p.name}">
          <div class="card-body text-center">
            <h6>${p.name}</h6>
            <p>₹${p.price}</p>
            <button class="btn btn-dark" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>`;
    });
}

function filter(cat) {
    renderProducts(products.filter(p => p.category === cat));
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let it = cart.find(x => x.id === id);
    if (it) it.qty++;
    else {
        let p = products.find(x => x.id === id);
        cart.push({ ...p, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let c = document.getElementById("cartItems");
    let emptyDiv = document.getElementById("emptyCart");
    let contentDiv = document.getElementById("cartContent");
    let t = 0;

    if (cart.length === 0) {
        if (emptyDiv) emptyDiv.style.display = "block";
        if (contentDiv) contentDiv.style.display = "none";
        return;
    }

    if (emptyDiv) emptyDiv.style.display = "none";
    if (contentDiv) contentDiv.style.display = "block";

    c.innerHTML = "";
    cart.forEach((p, index) => {
        t += p.price * p.qty;
        c.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-2">
              <img src="images/${p.img}" alt="${p.name}" class="img-fluid">
            </div>
            <div class="col-md-4">
              <h6>${p.name}</h6>
              <p class="text-muted mb-0">₹${p.price}</p>
            </div>
            <div class="col-md-3">
              <div class="input-group">
                <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${p.id}, -1)">-</button>
                <input type="text" class="form-control form-control-sm text-center" value="${p.qty}" readonly style="max-width: 60px;">
                <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${p.id}, 1)">+</button>
              </div>
            </div>
            <div class="col-md-2">
              <strong>₹${p.price * p.qty}</strong>
            </div>
            <div class="col-md-1">
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${p.id})">×</button>
            </div>
          </div>
        </div>
      </div>`;
    });

    document.getElementById("total").innerText = t;
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cnt = cart.reduce((s, x) => s + x.qty, 0);
    let el = document.getElementById("cartCount");
    if (el) el.innerText = cnt;
}

function validateForm() {
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    if (nameField.value.trim() === "" || emailField.value.trim() === "" || messageField.value.trim() === "") {
        alert("Please fill all fields");
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        alert("Please enter a valid email address");
        return false;
    }

    alert("Thank you! Your message has been sent.");
    nameField.value = "";
    emailField.value = "";
    messageField.value = "";
    return false;
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(x => x.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        localStorage.removeItem("cart");
        loadCart();
        updateCartCount();
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`Thank you for your order!\n\nTotal: ₹${total}\n\nThis is a demo checkout. In a real store, you would be redirected to a payment page.`);

    // Clear cart after checkout
    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();
}

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'products.html';
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    document.getElementById('productImage').src = `images/${product.img}`;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price;
    document.getElementById('productDescription').textContent = product.description;

    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Store product ID for add to cart
    document.getElementById('addToCartBtn').setAttribute('data-product-id', productId);
}

function addToCartFromDetail() {
    const productId = parseInt(document.getElementById('addToCartBtn').getAttribute('data-product-id'));
    addToCart(productId);
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    featuredContainer.innerHTML = '';
    products.forEach(p => {
        featuredContainer.innerHTML += `
      <div class="col-md-6 col-lg-3 mb-4">
        <div class="product-card">
          <div class="product-image">
            <img src="images/${p.img}" alt="${p.name}">
            <div class="product-badge">New</div>
          </div>
          <div class="product-info">
            <h5 class="product-title">${p.name}</h5>
            <p class="product-price">₹${p.price}</p>
            <button class="btn btn-dark btn-sm w-100" onclick="addToCart(${p.id})">
              <i class="fas fa-cart-plus me-2"></i>Add to Cart
            </button>
          </div>
        </div>
      </div>`;
    });
}
