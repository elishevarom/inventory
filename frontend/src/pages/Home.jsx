import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';

const Home = () => (
  <div className="text-center">
    <FaBoxOpen size={60} className="text-primary mb-3" />
    <h1>Welcome to Inventory Tracker</h1>
    <p className="lead">Effortlessly track, manage, and view your stock in real-time.</p>
    <img src="https://undraw.co/api/illustrations/35a180d5-c678-4e4e-8d0c-6e4c04d8d997" alt="inventory" className="img-fluid mt-4 rounded shadow" />
  </div>
);
export default Home;