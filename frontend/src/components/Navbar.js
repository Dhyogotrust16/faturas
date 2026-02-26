import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav style={{ background: '#343a40', padding: '16px', color: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/clientes" style={{ color: 'white', textDecoration: 'none' }}>Clientes</Link>
          <Link to="/faturas" style={{ color: 'white', textDecoration: 'none' }}>Faturas</Link>
        </div>
        <button onClick={onLogout} className="btn" style={{ background: '#dc3545', color: 'white' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
