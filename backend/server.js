require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const seedDatabase = require('./seed');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const faturasRoutes = require('./routes/faturas');
const empresaRoutes = require('./routes/empresa');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/faturas', faturasRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Função para atualizar status de faturas vencidas
function atualizarFaturasVencidas() {
  const agora = new Date();
  const brasiliaOffset = -3 * 60;
  const utcTime = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  const brasilia = new Date(utcTime + (brasiliaOffset * 60000));
  const dataAtualBrasilia = `${brasilia.getFullYear()}-${String(brasilia.getMonth() + 1).padStart(2, '0')}-${String(brasilia.getDate()).padStart(2, '0')}`;
  
  db.run(
    `UPDATE faturas 
     SET status = 'vencido' 
     WHERE status = 'pendente' 
     AND data_vencimento < ?`,
    [dataAtualBrasilia],
    (err) => {
      if (err) {
        console.error('[Auto-Update] Erro ao atualizar status vencido:', err);
      } else {
        console.log(`[Auto-Update] Status de faturas vencidas atualizado (${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })})`);
      }
    }
  );
}

// Executar atualização ao iniciar o servidor
atualizarFaturasVencidas();

// Executar atualização a cada 1 hora (3600000 ms)
setInterval(atualizarFaturasVencidas, 3600000);

// Inicializar banco de dados e criar usuário admin se necessário
seedDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`⏰ Auto-atualização de status ativada (verifica a cada 1 hora)`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao inicializar banco de dados:', err);
    process.exit(1);
  });
