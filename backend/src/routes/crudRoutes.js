import { Router } from 'express';

// Cria as quatro rotas padrão de um cadastro a partir do seu controller
export function createCrudRoutes(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);

  return router;
}
