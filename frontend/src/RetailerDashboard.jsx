import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RetailerDashboard() {
  const [data, setData] = useState({ activeSessions: 142, revenue: 14500, autoCampaigns: 4 });
  
  // Real time metric simulation to showcase reactive operations
  useEffect(() => {
     const iId = setInterval(() => {
        setData(p => ({ ...p, activeSessions: p.activeSessions + Math.floor(Math.random()*5 - 2) }))
     }, 2000);
     return () => clearInterval(iId);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', color: '#2b2b2b', padding: '3rem', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      
      <header style={{ marginBottom: '3rem', borderBottom: '2px solid #e1e4e8', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0d47a1', margin: 0 }}>AURA RETAIL OS: INTELLIGENCE HUB</h1>
           <p style={{ color: '#555', fontSize: '1.1rem', margin: '8px 0 0' }}>B2B Operations Control Panel | Data, Automation, & Personalization.</p>
        </div>
        <div style={{ background: '#e3f2fd', color: '#0d47a1', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold' }}>
           System Status: AI Active 🟢
        </div>
      </header>
      
      {/* KPI DATA BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
         <motion.div whileHover={{ y: -5 }} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: 0, color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Engaged Shoppers</h3>
            <p style={{ margin: '1rem 0 0', fontSize: '3rem', color: '#000', fontWeight: 'bold' }}>{data.activeSessions}</p>
         </motion.div>
         <motion.div whileHover={{ y: -5 }} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: 0, color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI-Driven Personalization Lift</h3>
            <p style={{ margin: '1rem 0 0', fontSize: '3rem', color: '#43a047', fontWeight: 'bold' }}>+18.4%</p>
         </motion.div>
         <motion.div whileHover={{ y: -5 }} style={{ background: '#0d47a1', color: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(13,71,161,0.2)' }}>
            <h3 style={{ margin: 0, color: '#bbdefb', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Auto-Campaigns</h3>
            <p style={{ margin: '1rem 0 0', fontSize: '3rem', fontWeight: 'bold' }}>{data.autoCampaigns}</p>
         </motion.div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
         
         {/* AUTOMATION ENGINE WIDGET */}
         <div style={{ flex: '1 1 400px', background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
             <h2 style={{ fontSize: '1.6rem', color: '#111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ⚙️ Predictive Automation Engine
             </h2>
             <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                The AI monitors behavioral click data in real-time. If a product hits high viewership but low cart conversions, it autonomously deploys a 15% discount flash sale to secure the transaction.
             </p>

             <div style={{ background: '#f9f9f9', borderLeft: '4px solid #f57c00', padding: '15px' }}>
                <div style={{ color: '#d84315', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>AUTOMATION LOG (RECENT):</div>
                <div style={{ color: '#333' }}>Detected 3 unique views on 'Radiant Headset'.</div>
                <div style={{ color: '#111', fontWeight: 'bold', marginTop: '10px' }}>Action Taken: Auto-slashed price to drive 15% immediate urgency. Resulted in 2 sales.</div>
             </div>
         </div>

         {/* PERSONALIZATION & DATA INSIGHTS WIDGET */}
         <div style={{ flex: '1 1 400px', background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
             <h2 style={{ fontSize: '1.6rem', color: '#111', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🧠 Shopper Personalization
             </h2>
             <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
                Machine learning segments users dynamically. E-commerce feeds are reordered on load based on individual interaction history.
             </p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Cohort A (Gamers)</span>
                    <span style={{ color: '#0d47a1', fontWeight: 'bold' }}>Serving Tech Ads First</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Cohort B (Fashion)</span>
                    <span style={{ color: '#0d47a1', fontWeight: 'bold' }}>Serving Apparell First</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontWeight: 'bold' }}>Gamification Hub Status</span>
                    <span style={{ color: '#43a047', fontWeight: 'bold' }}>Driving +40% Retention</span>
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
}
