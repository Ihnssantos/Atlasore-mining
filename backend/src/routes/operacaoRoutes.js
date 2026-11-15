import { Router } from 'express';
import { registros } from '../operacao/registros.js';
import { createOperacaoRepository } from '../repositories/operacaoRepository.js';
import { createOperacaoController } from '../controllers/operacaoController.js';

const router = Router();

// Monta repositório, controller e rotas de cada registro e publica em /<path>
registros.forEach((registro) => {
  const repository = createOperacaoRepository(registro);
  const controller = createOperacaoController(registro, repository);

  const registroRouter = Router();
  registroRouter.get('/', controller.list);
  registroRouter.get('/:id', controller.getById);
  registroRouter.post('/', controller.create);
  registroRouter.patch('/:id', controller.update);
  registroRouter.delete('/:id', controller.remove);

  router.use(`/${registro.path}`, registroRouter);
});

export default router;
