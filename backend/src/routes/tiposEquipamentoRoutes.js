import { Router } from 'express';
import * as controller from '../controllers/tiposEquipamentoController.js';

const router = Router();

// Rotas de tipos de equipamento, montadas em /tipos-equipamento
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);

export default router;