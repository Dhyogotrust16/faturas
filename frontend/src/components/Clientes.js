import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', cpf_cnpj: '', email: '', telefone: '', endereco: '' });
  const [editando, setEditando] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('/api/clientes', config);
      setClientes(response.data);
    } catch (error) {
      alert('Erro ao buscar clientes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`/api/clientes/${editando}`, form, config);
        alert('Cliente atualizado!');
      } else {
        await axios.post('/api/clientes', form, config);
        alert('Cliente criado!');
      }
      setForm({ nome: '', cpf_cnpj: '', email: '', telefone: '', endereco: '' });
      setEditando(null);
      fetchClientes();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setForm(cliente);
    setEditando(cliente.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja deletar este cliente?')) {
      try {
        await axios.delete(`/api/clientes/${id}`, config);
        fetchClientes();
      } catch (error) {
        alert('Erro ao deletar cliente');
      }
    }
  };

  return (
    <div className="container">
      <h1>Clientes</h1>
      <div className="card">
        <h3>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>CPF/CNPJ</label>
            <input value={form.cpf_cnpj} onChange={(e) => setForm({...form, cpf_cnpj: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">{editando ? 'Atualizar' : 'Criar'}</button>
          {editando && <button type="button" onClick={() => { setForm({ nome: '', cpf_cnpj: '', email: '', telefone: '', endereco: '' }); setEditando(null); }} style={{ marginLeft: '10px' }}>Cancelar</button>}
        </form>
      </div>

      <div className="card">
        <h3>Lista de Clientes</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf_cnpj}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <button onClick={() => handleEdit(cliente)} className="btn btn-primary" style={{ marginRight: '8px' }}>Editar</button>
                  <button onClick={() => handleDelete(cliente.id)} className="btn btn-danger">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;
