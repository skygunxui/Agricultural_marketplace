const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory data storage
let farmers = [
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

let orders = [];

// API Routes

// GET /api/farmers - Fetch all farmers with optional search and filter
app.get('/api/farmers', (req, res) => {
    let { search, location, produce } = req.query;
    let filtered = farmers;

    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(f =>
            f.name.toLowerCase().includes(query) ||
            f.location.toLowerCase().includes(query) ||
            f.produce.some(p => p.toLowerCase().includes(query))
        );
    }

    if (location) {
        filtered = filtered.filter(f => f.location.toLowerCase() === location.toLowerCase());
    }

    if (produce) {
        filtered = filtered.filter(f => f.produce.map(p => p.toLowerCase()).includes(produce.toLowerCase()));
    }

    res.json(filtered);
});

// POST /api/farmers - Register a new farmer
app.post('/api/farmers', (req, res) => {
    const { name, location, phone, description, produce, deliveryRadius } = req.body;
    if (!name || !location || !phone || !description || !produce || !deliveryRadius) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newFarmer = {
        id: farmers.length + 1,
        name,
        location,
        phone,
        description,
        produce: produce.split(',').map(p => p.trim()),
        deliveryRadius: parseInt(deliveryRadius),
        rating: 5.0,
        reviews: [],
        availability: "Mon-Sat",
        calendar: "Available all week"
    };

    farmers.push(newFarmer);
    res.status(201).json(newFarmer);
});

// POST /api/reviews - Add a review to a farmer
app.post('/api/reviews', (req, res) => {
    const { farmerId, user, comment, stars } = req.body;
    if (!farmerId || !user || !comment || !stars) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const farmer = farmers.find(f => f.id === parseInt(farmerId));
    if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
    }

    farmer.reviews.push({ user, comment, stars: parseInt(stars) });
    farmer.rating = (farmer.reviews.reduce((sum, r) => sum + r.stars, 0) / farmer.reviews.length).toFixed(1);

    res.status(201).json({ message: 'Review added successfully' });
});

// GET /api/orders - Fetch all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// POST /api/orders - Place a new order
app.post('/api/orders', (req, res) => {
    const { farmerId, buyerName, buyerEmail, orderDetails } = req.body;
    if (!farmerId || !buyerName || !buyerEmail || !orderDetails) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const farmer = farmers.find(f => f.id === parseInt(farmerId));
    if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
    }

    const newOrder = {
        id: orders.length + 1,
        farmer: farmer.name,
        buyer: buyerName,
        email: buyerEmail,
        details: orderDetails,
        status: "Pending"
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// DELETE /api/orders/:id - Cancel an order
app.delete('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    orders.splice(index, 1);
    res.json({ message: 'Order cancelled successfully' });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`AgriMarket server running on http://localhost:${PORT}`);
});
