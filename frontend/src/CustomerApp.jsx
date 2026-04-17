import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerApp() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('player1');
  const [password, setPassword] = useState('password');

  const [tab, setTab] = useState('shop'); 
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({});

  // Mobile Responsiveness Hook
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
     const h = () => setIsMobile(window.innerWidth < 768);
     window.addEventListener('resize', h);
     return () => window.removeEventListener('resize', h);
  }, []);

  // Gamification Aim Trainer State
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: 50, left: 50 });
  const [gameResult, setGameResult] = useState(null);

  // Custom Modal State for Understandability
  const [errorModal, setErrorModal] = useState("");

  const themeOptions = {
    bg: '#0F1215',       
    card: '#1D2127',     
    accent: '#FFA500',   
    text: '#E0E6ED',
    redHover: '#FF4655'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
        setUser(data.user);
        fetchCatalog(data.user.id);
        fetchCart(data.user.id);
        fetchProfile(data.user.id);
    } else alert(data.message);
  };

  const fetchCatalog = async (uid) => {
    const res = await fetch(`http://localhost:5000/api/v1/recommendations/${uid}`);
    const data = await res.json();
    setProducts(data.recommendedProducts);
  };

  const fetchCart = async (uid) => {
    const res = await fetch(`http://localhost:5000/api/v1/cart/${uid}`);
    const data = await res.json();
    setCartItems(data);
  };

  const fetchOrders = async (uid) => {
    const res = await fetch(`http://localhost:5000/api/v1/orders/${uid}`);
    const data = await res.json();
    setOrders(data);
  };

  const fetchProfile = async (uid) => {
    const res = await fetch(`http://localhost:5000/api/v1/profile/${uid}`);
    const data = await res.json();
    setProfile(data);
    setUser(data);
  };

  const addToCart = async (product, e) => {
    e.stopPropagation();
    await fetch("http://localhost:5000/api/v1/cart/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id })
    });
    fetchCart(user.id);
  };

  const checkout = async () => {
    const res = await fetch("http://localhost:5000/api/v1/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
    });
    const data = await res.json();
    if (data.success) {
       alert(`🔥 AIRDROP DISPATCHED! Remaining BP: ${data.new_balance}`);
       setTab('orders');
       fetchOrders(user.id);
       fetchProfile(user.id);
       setCartItems([]);
    } else {
       // CLEAR UX CONNECTION: If they fail, tell them EXACTLY what to do.
       setErrorModal(data.error); 
    }
  };

  const startGame = () => { setScore(0); setTimeLeft(10); setGameActive(true); setGameResult(null); moveTarget(); };
  const hitTarget = () => { if(!gameActive) return; setScore(p => p + 1); moveTarget(); };
  const moveTarget = () => { setTargetPos({ top: 15 + Math.random() * 70, left: 15 + Math.random() * 70 }); };

  useEffect(() => {
      let timer;
      if (gameActive && timeLeft > 0) timer = setTimeout(() => setTimeLeft(p => p - 1), 1000);
      else if (gameActive && timeLeft === 0) {
          setGameActive(false);
          submitGameScore();
      }
      return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const submitGameScore = async () => {
      const res = await fetch("http://localhost:5000/api/v1/game/reward", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, score })
      });
      const data = await res.json();
      if(data.success) {
          setGameResult(`MATCH COMPLETE! YOU EARNED +${data.earned_avp} BP.`);
          fetchProfile(user.id);
      }
  };

  if (!user) {
     return (
        <div style={{ minHeight: '100vh', background: '#0F1215', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
           <div style={{ background: '#1D2127', padding: '40px', borderTop: `4px solid ${themeOptions.accent}`, width: isMobile ? '90%' : '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <h1 style={{ color: '#fff', fontSize: '28px', fontStyle: 'italic', marginBottom: '5px', fontWeight: 900 }}>AURA // BATTLEGROUNDS</h1>
              <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px', lineHeight: 1.5 }}>The world's first Play-to-Buy platform. Play tactical minigames to earn store credit (BP).</p>
              
              <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Player ID" style={{ width: '100%', padding: '15px', marginBottom: '15px', background: '#111', color: '#fff', border: '1px solid #333', outline: 'none', borderRadius: '4px' }} />
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '15px', marginBottom: '30px', background: '#111', color: '#fff', border: '1px solid #333', outline: 'none', borderRadius: '4px' }} />
              
              <button onClick={handleLogin} style={{ width: '100%', padding: '15px', background: themeOptions.accent, color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}>ENTER THE ARENA</button>
           </div>
        </div>
     )
  }

  return (
    <div style={{ minHeight: '100vh', background: themeOptions.bg, color: themeOptions.text, fontFamily: '"Segoe UI", system-ui, sans-serif', overflowX: 'hidden' }}>
      
      {/* ERROR MODAL FOR UNDERSTANDABILITY */}
      {errorModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <div style={{ background: '#1D2127', border: '2px solid #FF4655', padding: '40px', width: '90%', maxWidth: '500px', textAlign: 'center', borderRadius: '8px' }}>
                <h2 style={{ color: '#FF4655', fontSize: '30px', margin: '0 0 15px', fontStyle: 'italic' }}>MISSION FAILED</h2>
                <p style={{ fontSize: '18px', color: '#fff', marginBottom: '30px', lineHeight: 1.5 }}>{errorModal}</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                   <button onClick={() => { setErrorModal(""); setTab('arena'); }} style={{ padding: '15px 25px', background: themeOptions.accent, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', borderRadius: '4px' }}>PLAY MATCH TO EARN BP</button>
                   <button onClick={() => setErrorModal("")} style={{ padding: '15px 25px', background: 'transparent', color: '#fff', border: '1px solid #555', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', borderRadius: '4px' }}>DISMISS</button>
                </div>
             </div>
          </div>
      )}

      {/* MATCH STATUS HEADER */}
      <div style={{ background: '#111', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #222' }}>
         <div style={{ display: 'flex', gap: '20px' }}>
            <span>AGENT: <strong style={{color: '#fff'}}>{profile.name}</strong></span>
            <span>TIER: <strong style={{color: themeOptions.accent}}>{profile.rank}</strong></span>
         </div>
         <div>VAULT: <span style={{ color: '#00FF00', fontWeight: 'bold', fontSize: '16px' }}>{profile.balance} BP</span></div>
      </div>

      {/* MOBILE-RESPONSIVE TOP NAVBAR */}
      <div style={{ background: themeOptions.card, padding: isMobile ? '15px' : '20px 40px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid #333`, gap: isMobile ? '15px' : '0' }}>
         <div style={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'space-between' }}>
            <h1 onClick={()=>setTab('shop')} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', cursor: 'pointer', color: '#fff', fontStyle: 'italic', fontWeight: 900 }}>AURA//<span style={{color: themeOptions.accent}}>COMMERCE</span></h1>
            {isMobile && (
               <div onClick={()=>setTab('cart')} style={{ cursor: 'pointer', color: '#000', background: themeOptions.accent, padding: '8px 15px', fontWeight: 'bold', borderRadius: '4px' }}>
                 AIRDROP DROP [{cartItems.length}]
               </div>
            )}
         </div>

         <div style={{ display: 'flex', gap: isMobile ? '10px' : '30px', fontWeight: '600', fontSize: isMobile ? '13px' : '15px', textTransform: 'uppercase', width: isMobile ? '100%' : 'auto', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '5px' : '0' }}>
             <motion.span whileHover={{ color: '#fff' }} onClick={()=>setTab('shop')} style={{ cursor: 'pointer', color: tab==='shop'?'#fff':'#777', borderBottom: tab==='shop'?`2px solid ${themeOptions.accent}`:'none', paddingBottom: '5px' }}>STORE</motion.span>
             <motion.span whileHover={{ color: '#fff' }} onClick={()=>setTab('arena')} style={{ cursor: 'pointer', color: tab==='arena'?'#fff':'#777', borderBottom: tab==='arena'?`2px solid ${themeOptions.accent}`:'none', paddingBottom: '5px', whiteSpace: 'nowrap' }}>PLAY & EARN 🎮</motion.span>
             <motion.span whileHover={{ color: '#fff' }} onClick={()=>setTab('orders')} style={{ cursor: 'pointer', color: tab==='orders'?'#fff':'#777', borderBottom: tab==='orders'?`2px solid ${themeOptions.accent}`:'none', paddingBottom: '5px', whiteSpace: 'nowrap' }}>INVENTORY</motion.span>
             <motion.span whileHover={{ color: '#fff' }} onClick={()=>setTab('profile')} style={{ cursor: 'pointer', color: tab==='profile'?'#fff':'#777', borderBottom: tab==='profile'?`2px solid ${themeOptions.accent}`:'none', paddingBottom: '5px', whiteSpace: 'nowrap' }}>PROFILE</motion.span>
             
             {!isMobile && (
               <div onClick={()=>setTab('cart')} style={{ cursor: 'pointer', color: '#000', background: themeOptions.accent, padding: '0 20px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                   OPEN CART [{cartItems.length}]
               </div>
             )}
         </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: isMobile ? '20px auto' : '40px auto', padding: '0 20px', paddingBottom: '100px' }}>
         
         {/* ARMORY (SHOP) VIEW */}
         {tab === 'shop' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               {/* Explicit Play-to-buy tutorial banner */}
               <div style={{ background: 'linear-gradient(90deg, #1D2127, #111)', borderLeft: `6px solid ${themeOptions.accent}`, padding: '25px', borderRadius: '8px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                     <h2 style={{ fontSize: '24px', margin: '0 0 5px', color: '#fff', fontStyle: 'italic' }}>HOW IT WORKS: SHOP BY PLAYING.</h2>
                     <p style={{ margin: 0, color: '#aaa', fontSize: '15px', lineHeight: 1.6 }}>1. Items below cost Battle Points (BP).<br/>2. If you are broke, click "PLAY & EARN" in the navbar to drop into a match.<br/>3. Earn BP from your score and spend it here on real rewards!</p>
                  </div>
                  <button onClick={()=>setTab('arena')} style={{ background: themeOptions.accent, color: '#000', padding: '12px 24px', fontWeight: 'bold', fontSize: '16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>PLAY A MATCH NOW</button>
               </div>

               <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '20px' }}>AI Recommended Loadout</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                  {products.map(p => (
                     <motion.div 
                        key={p.id} whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        style={{ background: themeOptions.card, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid #333' }}
                     >
                        {p.val_tier === "RADIANT TIER" && <div style={{ position: 'absolute', top: 12, right: 12, background: '#FF4655', color: '#fff', padding: '4px 10px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px', zIndex: 10 }}>LEGENDARY</div>}
                        
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                            <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        
                        <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                           <h4 style={{ margin: '0 0 5px', fontSize: '18px', color: '#fff' }}>{p.name}</h4>
                           <p style={{ fontSize: '13px', color: '#888', margin: '0 0 15px' }}>{p.category}</p>
                           
                           <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#00FF00', marginBottom: '20px' }}>{p.price} BP</div>
                           
                           <button onClick={(e) => addToCart(p, e)} style={{ width: '100%', background: '#2B3139', color: '#fff', border: 'none', padding: '14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s', marginTop: 'auto', ...({':hover': {background: themeOptions.accent, color: '#000'}}) }}>Add to Airdrop</button>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </motion.div>
         )}

         {/* TRAINING ARENA VIEW (Play to Earn minigame) */}
         {tab === 'arena' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
               <h2 style={{ fontSize: isMobile ? '26px' : '40px', margin: '0 0 10px', fontStyle: 'italic', color: '#fff' }}>COMBAT TRAINING ARENA</h2>
               <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '30px', background: '#1D2127', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00FF00' }}>
                  <strong>OBJECTIVE:</strong> Click the targets as fast as possible within 10 seconds. You earn <strong style={{color:'#00FF00'}}>40 Battle Points (BP)</strong> per successful hit. Store these points in your vault to buy real gear.
               </p>

               <div style={{ background: '#111', border: `2px solid #444`, borderRadius: '12px', width: '100%', height: isMobile ? '400px' : '500px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {!gameActive && timeLeft === 0 && !gameResult && (
                       <button onClick={startGame} style={{ padding: '20px 50px', fontSize: isMobile ? '20px' : '26px', background: themeOptions.accent, color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 900 }}>START MATCH</button>
                   )}

                   {gameActive && (
                       <>
                           <div style={{ position: 'absolute', top: 20, left: 20, fontSize: isMobile ? '20px' : '30px', fontWeight: 'bold', color: themeOptions.accent }}>TIME: {timeLeft}s</div>
                           <div style={{ position: 'absolute', top: 20, right: 20, fontSize: isMobile ? '20px' : '30px', fontWeight: 'bold', color: '#00FF00' }}>HITS: {score}</div>
                           
                           {/* THE TARGET */}
                           <div onClick={hitTarget} style={{ position: 'absolute', top: `${targetPos.top}%`, left: `${targetPos.left}%`, width: isMobile ? '60px' : '75px', height: isMobile ? '60px' : '75px', background: 'radial-gradient(circle, #ff4655 30%, transparent 40%, transparent 60%, #ff4655 70%, transparent 80%)', borderRadius: '50%', cursor: 'crosshair', transform: 'translate(-50%, -50%)', border: '3px solid #ff4655' }} />
                       </>
                   )}

                   {!gameActive && gameResult && (
                       <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(0,0,0,0.8)', borderRadius: '12px' }}>
                          <h3 style={{ fontSize: isMobile?'22px':'32px', color: '#00FF00', margin: '0 0 10px' }}>{gameResult}</h3>
                          <p style={{ color: '#fff', fontSize: '18px', marginBottom: '25px' }}>Your Vault is full. Go to the Store to spend it!</p>
                          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                             <button onClick={()=>setTab('shop')} style={{ padding: '15px 30px', fontSize: '16px', background: themeOptions.accent, color: '#000', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>GO TO STORE</button>
                             <button onClick={startGame} style={{ padding: '15px 30px', fontSize: '16px', background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>PLAY AGAIN</button>
                          </div>
                       </div>
                   )}
               </div>
            </motion.div>
         )}

         {/* CART / CHEKCOUT */}
         {tab === 'cart' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontStyle: 'italic', color: '#fff', margin: '0 0 30px' }}>REQUEST AIRDROP CARGO</h2>
               
               <div style={{ display: 'flex', gap: '30px', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ flex: '2', background: themeOptions.card, borderRadius: '8px', padding: isMobile ? '20px' : '30px', border: '1px solid #333' }}>
                      {cartItems.length === 0 ? <p style={{ fontSize: '18px', color: '#888' }}>Your airdrop cargo is empty. Go back to the store to add gear.</p> : cartItems.map((item, idx) => (
                         <div key={idx} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                             <img src={item.image} alt="prod" style={{ width: isMobile ? '80px' : '100px', height: isMobile ? '80px' : '100px', objectFit: 'cover', borderRadius: '8px' }} />
                             <div>
                                <h4 style={{ margin: '0 0 10px', fontSize: '20px', color: '#fff' }}>{item.name}</h4>
                                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00FF00' }}>{item.price} BP</div>
                             </div>
                         </div>
                      ))}
                  </div>
                  
                  {cartItems.length > 0 && (
                     <div style={{ flex: '1', background: '#111', borderRadius: '8px', border: `1px solid #444`, padding: '30px', height: 'fit-content' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#fff' }}>DELIVERY SUMMARY</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#aaa', fontSize: '16px' }}>
                           <span>Cart Total:</span>
                           <span>{cartItems.reduce((a,c)=>a+c.price,0)} BP</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderTop: '1px solid #333', paddingTop: '15px' }}>
                           <span>Your Wallet:</span>
                           <span style={{ color: '#00FF00' }}>{profile.balance} BP</span>
                        </div>
                        
                        <button onClick={checkout} style={{ width: '100%', background: themeOptions.accent, color: '#000', border: 'none', padding: '20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 900, fontSize: '18px', fontStyle: 'italic' }}>CONFIRM DEPLOYMENT</button>
                     </div>
                  )}
               </div>
            </motion.div>
         )}

         {/* MATCH HISTORY */}
         {tab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontStyle: 'italic', color: '#fff', margin: '0 0 30px' }}>COMBAT LOG & DELIVERIES</h2>
               
               {orders.length === 0 ? <p style={{ fontSize: '18px', color: '#888' }}>You haven't ordered any airdrops yet.</p> : orders.map((ord, i) => (
                  <div key={ord.orderId} style={{ background: themeOptions.card, borderRadius: '8px', padding: isMobile ? '20px' : '30px', marginBottom: '25px', border: '1px solid #333' }}>
                     <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', gap: '10px' }}>
                        <div style={{ color: '#888', fontSize: '14px' }}>DATE <br/><strong style={{color: '#fff', fontSize: '16px'}}>{new Date(ord.date).toLocaleDateString()}</strong></div>
                        <div style={{ color: '#888', fontSize: '14px' }}>COST <br/><strong style={{color: '#fff', fontSize: '16px'}}>{ord.total} BP</strong></div>
                        <div style={{ color: '#888', fontSize: '14px' }}>ID <br/><strong style={{color: '#fff', fontSize: '16px'}}>{ord.orderId}</strong></div>
                     </div>
                     <h3 style={{ fontSize: '20px', color: '#00FF00', margin: '0 0 20px' }}>{ord.status}</h3>
                     <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                         {ord.items.map((imgItem, ix) => <img key={ix} src={imgItem.image} alt="loot" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '6px', border: '1px solid #444' }} />)}
                     </div>
                  </div>
               ))}
            </motion.div>
         )}

         {/* PROFILE SECTION */}
         {tab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: themeOptions.card, padding: isMobile ? '25px' : '40px', borderRadius: '12px', border: '1px solid #333' }}>
               <h2 style={{ fontSize: isMobile ? '30px' : '40px', margin: '0 0 30px', color: '#fff' }}>PLAYER CARD: {profile.name}</h2>
               <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px' }}>
                   <div style={{ background: '#111', padding: '25px', borderRadius: '8px' }}>
                      <p style={{ color: '#888', margin: '0 0 10px', fontSize: '14px' }}>CURRENT RANK</p>
                      <h3 style={{ color: themeOptions.accent, fontSize: '32px', margin: 0 }}>{profile.rank}</h3>
                   </div>
                   <div style={{ background: '#111', padding: '25px', borderRadius: '8px' }}>
                      <p style={{ color: '#888', margin: '0 0 10px', fontSize: '14px' }}>LIFETIME XP</p>
                      <h3 style={{ color: '#fff', fontSize: '32px', margin: 0 }}>{profile.xp}</h3>
                   </div>
                   <div style={{ background: '#111', padding: '25px', borderRadius: '8px', border: '1px solid #00FF00' }}>
                      <p style={{ color: '#00FF00', margin: '0 0 10px', fontSize: '14px' }}>VAULT (BATTLE POINTS)</p>
                      <h3 style={{ color: '#00FF00', fontSize: '40px', margin: 0 }}>{profile.balance}</h3>
                   </div>
               </div>
            </motion.div>
         )}

      </div>
    </div>
  );
}
