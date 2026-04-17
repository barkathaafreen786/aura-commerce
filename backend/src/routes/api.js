const express = require('express');
const router = express.Router();

const users = {
  "player1": { id: "U1", password: "password", name: "Alpha Squad Leader", xp: 0, rank: "Bronze V", balance: 500 }
};

const carts = { "U1": [] };
const orders = { "U1": [] };
let events = [];

const categories = ['Tactical Gear', 'Survival Kits', 'Hardware Drops', 'Apparel', 'Rations'];
const adjs = ['Camouflage', 'Military', 'Stealth', 'Airdrop', 'Combat', 'Recon', 'Elite', 'Titanium'];

const nounData = [
  { name: 'Headset', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Tactical Jacket', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Energy Fuel', img: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cologne', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Controller', img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80' },
  { name: 'Navigation Tablet', img: 'https://images.unsplash.com/photo-1544228807-6bb30e998d36?auto=format&fit=crop&w=400&q=80' },
  { name: 'Combat Boots', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chronograph', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
  { name: 'Gaming Mouse', img: 'https://images.unsplash.com/photo-1615663245857-ac1eeb536fa2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ultra Monitor', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80' }
];

const products = [];
for(let i=1; i<=40; i++) {
   const c = categories[i % categories.length];
   const nounObj = nounData[(i * 3) % nounData.length];
   const n = `${adjs[i % adjs.length]} ${nounObj.name}`;
   const price = 50 + Math.floor(Math.random() * 800); 
   products.push({
      id: `P${i}`,
      name: n.toUpperCase(),
      category: c.toUpperCase(),
      price: price, 
      image: nounObj.img, // High Def images
      val_tier: Math.random() > 0.9 ? "RADIANT TIER" : "STANDARD"
   });
}

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ success: true, user: users[username] });
    } else {
        res.status(401).json({ success: false, message: "Use player1 / password" });
    }
});

router.get('/profile/:userId', (req, res) => {
    const u = Object.values(users).find(x => x.id === req.params.userId);
    res.json(u || {});
});

router.post('/game/reward', (req, res) => {
    const { userId, score } = req.body;
    const u = Object.values(users).find(x => x.id === userId);
    
    if (u) {
       const avpReward = score * 40; // High stakes BP rewards
       const xpReward = score * 50;
       
       u.balance += avpReward;
       u.xp += xpReward;

       if (u.xp > 10000) u.rank = "Conqueror";
       else if (u.xp > 5000) u.rank = "Crown";
       else if (u.xp > 2000) u.rank = "Diamond";
       else if (u.xp > 500) u.rank = "Platinum";

       res.json({ success: true, earned_avp: avpReward, total_avp: u.balance, new_rank: u.rank });
    } else {
       res.status(400).json({ error: "User not found" });
    }
});

router.post('/event', (req, res) => res.json({ status: "tracked" }));

router.get('/recommendations/:userId', (req, res) => {
    // Randomize feed slightly for the chaotic battle royale vibe
    const sortedProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 20);
    res.json({ recommendedProducts: sortedProducts });
});

router.get('/cart/:userId', (req, res) => {
    res.json(carts[req.params.userId] || []);
});

router.post('/cart/add', (req, res) => {
    const { userId, productId } = req.body;
    if (!carts[userId]) carts[userId] = [];
    const prod = products.find(p => p.id === productId);
    if(prod) carts[userId].push(prod);
    
    res.json({ success: true, cartCount: carts[userId].length });
});

router.post('/checkout', (req, res) => {
    const { userId } = req.body;
    if (!carts[userId] || carts[userId].length === 0) return res.status(400).json({ error: "Cart is empty" });
    
    const totalBP = carts[userId].reduce((sum, p) => sum + p.price, 0);
    const u = Object.values(users).find(x => x.id === userId);
    
    if (u.balance < totalBP) {
        return res.status(400).json({ error: `Insufficient Battle Points (BP). Grind the Arena to earn ${totalBP - u.balance} more BP.` });
    }

    u.balance -= totalBP; 
    const orderId = "AIRDROP-" + Math.floor(Math.random()*10000);

    const newOrder = {
        orderId,
        date: new Date().toISOString(),
        items: [...carts[userId]],
        total: totalBP,
        status: "IN TRANSIT VIA CARGO PLANE"
    };

    if(!orders[userId]) orders[userId] = [];
    orders[userId].unshift(newOrder); 
    carts[userId] = []; 

    res.json({ success: true, order: newOrder, new_balance: u.balance });
});

module.exports = router;
