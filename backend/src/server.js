import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import tiposEquipamentoRoutes from './routes/tiposEquipamentoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Permite que o front-end, em outra porta, chame a API
app.use(cors());

// Converte o corpo das requisições de JSON para objeto JavaScript
app.use(express.json());

// Registra as rotas da aplicação
app.use('/health', healthRoutes);
app.use('/tipos-equipamento', tiposEquipamentoRoutes);

// Deve vir depois das rotas para capturar os erros delas
app.use(errorHandler);

// Inicia o servidor na porta definida no .env, ou na 3000 por padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});