// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements
const cartBtn = document.getElementById("cart-button");
const cartBtnMobile = document.getElementById("cart-button-mobile");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartCount = document.getElementById("cart-count");
const cartCountMobile = document.getElementById("cart-count-mobile");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const itemElement = document.createElement("div");
      itemElement.className = "flex justify-between items-center border-b pb-2";
      itemElement.innerHTML = `
        <div>
          <h4 class="font-semibold">${item.name}</h4>
          <p class="text-sm text-gray-500">Shade: ${item.size}</p>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="flex items-center">
          <button onclick="changeQuantity(${index}, -1)" class="px-2">&minus;</button>
          <span class="px-2">${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)" class="px-2">&plus;</button>
          <button onclick="removeFromCart(${index})" class="text-red-500 ml-2">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountMobile.textContent = cartCount.textContent;
  cartTotalEl.textContent = total.toFixed(2);
  saveCart();
}

function addToCart(product) {
  const existingIndex = cart.findIndex(
    item => item.name === product.name && item.size === product.size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  openCart();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openCart() {
  cartSidebar.classList.remove("translate-x-full");
  cartOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.add("translate-x-full");
  cartOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// Attach event listeners
cartBtn.addEventListener("click", openCart);
cartBtnMobile?.addEventListener("click", openCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert(`Payment of $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} successful!\nThank you for your purchase.`);
    cart = [];
    updateCartUI();
    closeCart();
  }
});

// Add to cart buttons
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const card = btn.closest(".product-card");
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const sizes = JSON.parse(card.dataset.sizes);
    const size = sizes[0];
    addToCart({ name, price, size });
  });
});

updateCartUI();
