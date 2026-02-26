import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ clientes: 0, faturas: 0, pendentes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [clientesRes, faturasRes] = await Promise.all([
          axios.get('/api/clientes', config),
          axios.get('/api/faturas', config)
        ]);

        setStats({
          clientes: clientesRes.data.length,
          faturas: faturasRes.data.length,
          pendentes: faturasRes.data.filter(f => f.status === 'pendente').length
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Clientes</h3>
          <p style={{ fontSize: '48px', color: '#007bff' }}>{stats.clientes}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Faturas</h3>
          <p style={{ fontSize: '48px', color: '#28a745' }}>{stats.faturas}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Pendentes</h3>
          <p style={{ fontSize: '48px', color: '#ffc107' }}>{stats.pendentes}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
