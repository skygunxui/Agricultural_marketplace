// AgriMarket Interactive JS - Enhanced Experience

// --- Section Navigation ---
function showSection(sectionId, btn) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Demo Data ---
const farmers = [
    {
        id: 1,
        name: "Green Valley Farms",
        location: "Downtown",
        phone: "+91 9876543210",
        description: "Organic vegetables and fruits grown with love.",
        produce: ["Vegetables", "Fruits"],
        deliveryRadius: 10,
        rating: 4.8,
        reviews: [
            { user: "Amit", comment: "Fresh and tasty!", stars: 5 },
            { user: "Priya", comment: "Quick delivery.", stars: 4 }
        ],
        availability: "Mon-Sat",
        calendar: "Available all week"
    },
    {
        id: 2,
        name: "Sunrise Orchards",
        location: "Suburbs",
        phone: "+91 9123456780",
        description: "Seasonal fruits and homemade jams.",
        produce: ["Fruits", "Herbs"],
        deliveryRadius: 15,
        rating: 4.6,
        reviews: [
            { user: "Rahul", comment: "Loved the mangoes!", stars: 5 }
        ],
        availability: "Tue-Sun",
        calendar: "Closed Mondays"
    }
];

// --- Render Farmers Directory ---
function renderFarmers(list = farmers) {
    const grid = document.getElementById('farmersGrid');
    grid.innerHTML = '';
    if (list.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:#888;">No farmers found.</div>';
        return;
    }
    list.forEach(farmer => {
        const card = document.createElement('div');
        card.className = 'farmer-card';
        card.innerHTML = `
            <h3>${farmer.name}</h3>
            <div class="location">📍 ${farmer.location}</div>
            <div class="produce">🥕 ${farmer.produce.join(', ')}</div>
            <div class="availability">🗓️ ${farmer.availability}</div>
            <div class="rating">${renderStars(farmer.rating)} <span style="color:#388e3c;font-weight:500;">${farmer.rating}</span></div>
            <button class="view-btn" onclick="openFarmerModal(${farmer.id})">View Profile</button>
        `;
        grid.appendChild(card);
    });
}
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span style="color:${i <= Math.round(rating) ? '#ffb300' : '#ccc'};">★</span>`;
    }
    return stars;
}
renderFarmers();

// --- Search & Filter ---
function searchFarmers() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = farmers.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.location.toLowerCase().includes(query) ||
        f.produce.some(p => p.toLowerCase().includes(query))
    );
    renderFarmers(filtered);
    showSection('farmers', document.querySelector('.nav-btn:nth-child(2)'));
}

function filterFarmers() {
    const loc = document.getElementById('locationFilter').value;
    const prod = document.getElementById('produceFilter').value;
    let filtered = farmers;
    if (loc) filtered = filtered.filter(f => f.location.toLowerCase() === loc);
    if (prod) filtered = filtered.filter(f => f.produce.map(p => p.toLowerCase()).includes(prod));
    renderFarmers(filtered);
}

// --- Farmer Modal ---
function openFarmerModal(id) {
    const farmer = farmers.find(f => f.id === id);
    if (!farmer) return;
    document.getElementById('farmerDetails').innerHTML = `
        <h2 style="margin-bottom:0.5em;">${farmer.name}</h2>
        <div><b>Location:</b> ${farmer.location}</div>
        <div><b>Phone:</b> <a href="tel:${farmer.phone}" style="color:#388e3c;text-decoration:none;">${farmer.phone}</a></div>
        <div><b>Description:</b> ${farmer.description}</div>
        <div><b>Produce:</b> ${farmer.produce.join(', ')}</div>
        <div><b>Delivery Radius:</b> ${farmer.deliveryRadius} km</div>
        <div><b>Availability:</b> ${farmer.calendar}</div>
        <div><b>Rating:</b> ${renderStars(farmer.rating)} <span style="color:#388e3c;font-weight:500;">${farmer.rating}</span></div>
        <div><b>Reviews:</b>
            <ul style="padding-left:1em;">
                ${farmer.reviews.map(r => `<li><b>${r.user}</b>: "${r.comment}" (${renderStars(r.stars)})</li>`).join('')}
            </ul>
        </div>
        <div style="margin:1em 0;">
            <button onclick="showReviewForm(${farmer.id})" style="background:#388e3c;color:#fff;border:none;border-radius:8px;padding:0.5em 1em;cursor:pointer;">Add Review</button>
        </div>
        <div id="reviewFormContainer"></div>
    `;
    document.getElementById('farmerModal').style.display = 'flex';
    document.getElementById('farmerModal').dataset.farmerId = id;
}
function closeModal() {
    document.getElementById('farmerModal').style.display = 'none';
}

// --- Review System ---
function showReviewForm(farmerId) {
    document.getElementById('reviewFormContainer').innerHTML = `
        <form id="reviewForm" style="margin-top:1em;">
            <input type="text" id="reviewUser" placeholder="Your Name" required style="margin-bottom:0.5em;width:100%;padding:0.5em;">
            <textarea id="reviewComment" placeholder="Your Review" required style="margin-bottom:0.5em;width:100%;padding:0.5em;"></textarea>
            <label for="reviewStars">Rating:</label>
            <select id="reviewStars" required style="margin-bottom:0.5em;">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Bad</option>
            </select>
            <button type="submit" style="background:#4caf50;color:#fff;border:none;border-radius:8px;padding:0.5em 1em;cursor:pointer;">Submit Review</button>
        </form>
    `;
    document.getElementById('reviewForm').onsubmit = function(e) {
        e.preventDefault();
        const user = document.getElementById('reviewUser').value;
        const comment = document.getElementById('reviewComment').value;
        const stars = parseInt(document.getElementById('reviewStars').value);
        const farmer = farmers.find(f => f.id === farmerId);
        farmer.reviews.push({ user, comment, stars });
        // Update rating
        farmer.rating = (farmer.reviews.reduce((sum, r) => sum + r.stars, 0) / farmer.reviews.length).toFixed(1);
        showMessage("Thank you for your review!");
        openFarmerModal(farmerId);
    };
}

// --- Place Order ---
function placeOrder() {
    const id = parseInt(document.getElementById('farmerModal').dataset.farmerId);
    const farmer = farmers.find(f => f.id === id);
    const name = document.getElementById('buyerName').value;
    const email = document.getElementById('buyerEmail').value;
    const details = document.getElementById('orderDetails').value;
    if (!name || !email || !details) {
        showMessage("Please fill all order fields.");
        return;
    }
    showMessage(`Order sent to <b>${farmer.name}</b>!<br>We will contact you at <b>${email}</b>.`);
    closeModal();
    addOrder({ farmer: farmer.name, details, status: "Pending", buyer: name });
}

// --- Orders ---
let orders = [];
function addOrder(order) {
    orders.push(order);
    renderOrders();
}
function renderOrders() {
    const list = document.getElementById('ordersList');
    if (orders.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#888;">No orders yet.</div>';
        return;
    }
    list.innerHTML = orders.map((o, i) => `
        <div style="margin-bottom:1em;background:#f7f7fa;padding:1em;border-radius:10px;box-shadow:0 1px 4px #e9f5e1;">
            <b>Farmer:</b> ${o.farmer}<br>
            <b>Order:</b> ${o.details}<br>
            <b>Status:</b> <span style="color:#388e3c;">${o.status}</span><br>
            <b>Buyer:</b> ${o.buyer}
            <button onclick="cancelOrder(${i})" style="margin-top:0.5em;background:#e57373;color:#fff;border:none;border-radius:8px;padding:0.3em 0.8em;cursor:pointer;">Cancel</button>
        </div>
    `).join('');
}
function cancelOrder(index) {
    orders.splice(index, 1);
    renderOrders();
    showMessage("Order cancelled.");
}

// --- Farmer Registration ---
document.getElementById('farmerForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('farmerName').value;
    const location = document.getElementById('farmerLocation').value;
    const phone = document.getElementById('farmerPhone').value;
    const description = document.getElementById('farmerDescription').value;
    const produce = document.getElementById('farmerProduce').value.split(',').map(p => p.trim());
    const deliveryRadius = document.getElementById('deliveryRadius').value;
    if (!name || !location || !phone || !description || !produce.length || !deliveryRadius) {
        showMessage("Please fill all registration fields.");
        return;
    }
    farmers.push({
        id: farmers.length + 1,
        name, location, phone, description,
        produce, deliveryRadius,
        rating: 5.0,
        reviews: [],
        availability: "Mon-Sat",
        calendar: "Available all week"
    });
    renderFarmers();
    showMessage("Registration successful! Welcome to AgriMarket.");
    this.reset();
    showSection('farmers', document.querySelector('.nav-btn:nth-child(2)'));
};

// --- Message Modal ---
function showMessage(msg) {
    document.getElementById('messageContent').innerHTML = msg;
    document.getElementById('messageModal').style.display = 'flex';
}
function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// --- Map Placeholder Animation ---
document.querySelector('.map-placeholder').onclick = function() {
    showMessage("Interactive map coming soon! You'll be able to see farmers and delivery zones on a live map.");
};

// --- Initial Orders Render ---
renderOrders();

// --- Modal Accessibility ---
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            closeBtn.click();
        }
    });
});

// --- Add subtle animations ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.08)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
});