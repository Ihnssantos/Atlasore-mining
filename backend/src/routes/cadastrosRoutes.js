import { Router } from 'express';
import { cadastros } from '../cadastros/cadastros.js';
import { createRepository } from '../repositories/crudRepository.js';
import { createController } from '../controllers/crudController.js';
import { createCrudRoutes } from './crudRoutes.js';

const router = Router();

// Monta repositório, controller e rotas de cada cadastro e publica em /<path>
cadastros.forEach((cadastro) => {
  const repository = createRepository(cadastro);
  const controller = createController(cadastro, repository);
  router.use(`/${cadastro.path}`, createCrudRoutes(controller));
});

export default router;
