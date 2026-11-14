import { Router } from 'express';
import { checkHealth } from '../controllers/healthController.js';

const router = Router();

// Rota de verificação da API: GET /health
router.get('/', checkHealth);

export default router;