// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get('name');
const productPrice = urlParams.get('price');
const productRating = urlParams.get('rating');
const productImage = urlParams.get('image');
const productId = productName; // Ideally, use a unique ID if available

// Display product details
function displayProductDetails() {
    if (productName) document.getElementById('product-title').innerText = productName;
    if (productPrice) document.getElementById('product-price').innerText = `$${parseFloat(productPrice).toFixed(2)}`;
    if (productRating) document.getElementById('product-rating').innerText = `Rating: ${productRating}`;
    if (productImage) document.getElementById('product-image').src = productImage;
}

// Quantity controls
function setupQuantityControls() {
    const quantityElement = document.getElementById('quantity');
    
    if (quantityElement) {
        document.getElementById('increase-quantity').addEventListener('click', () => {
            let quantity = parseInt(quantityElement.innerText);
            quantityElement.innerText = quantity + 1;
        });

        document.getElementById('decrease-quantity').addEventListener('click', () => {
            let quantity = parseInt(quantityElement.innerText);
            if (quantity > 1) {
                quantityElement.innerText = quantity - 1;
            }
        });
    }
}

// Add to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Display products in cart
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productList = document.getElementById('cart-items');
    productList.innerHTML = ''; // Clear the current list
    let total = 0;

    cart.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.className = 'cart-item';

        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px;">
            <h3>${item.name}</h3>
            <p>Price: $<span class="item-price">${item.price.toFixed(2)}</span></p>
            <div class="quantity-controls">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <button class="delete-button" data-id="${item.id}">Delete</button>
        `;

        productList.appendChild(productDiv);
        total += item.price * item.quantity;

        // Event listeners for quantity and delete buttons
        productDiv.querySelector('.increase-quantity').addEventListener('click', () => {
            updateQuantity(item.id, 1);
        });
        productDiv.querySelector('.decrease-quantity').addEventListener('click', () => {
            updateQuantity(item.id, -1);
        });
        productDiv.querySelector('.delete-button').addEventListener('click', () => {
            removeFromCart(item.id);
        });
    });

    document.getElementById('total-price').innerText = `$${total.toFixed(2)}`;
}

// Update product quantity
function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }
}

// Remove product from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Setup buttons for product details page
function setupButtons() {
    const quantityElement = document.getElementById('quantity');
    
    if (document.getElementById('add-to-cart')) {
        document.getElementById('add-to-cart').addEventListener('click', () => {
            const quantity = parseInt(quantityElement.innerText);
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: quantity
            };
            addToCart(product);
        });
    }

    if (document.getElementById('buy-now')) {
        document.getElementById('buy-now').addEventListener('click', () => {
            alert(`Proceeding to buy ${productName}.`);
            window.location.href = 'cart.html';
        });
    }
}

// Combined window.onload function
window.onload = () => {
    displayProductDetails(); // Display product details on product-details.html
    setupQuantityControls(); // Set up quantity controls
    setupButtons(); // Set up button event listeners

    // Check if we are on the cart page
    if (window.location.pathname.endsWith('cart.html')) {
        displayCart(); // Display cart items if on cart.html
    }
    updateCartCount(); // Update the cart count on both pages
};
