import { Router } from 'express';
import { Container } from 'typedi';
import { TableController } from './table.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';

let router = Router();
let tableController = Container.get(TableController);

router.get('/',     authMiddleware, tableController.getAll);
router.get('/:id',  authMiddleware, tableController.getOne);
router.post('/',    authMiddleware, roleMiddleware('admin'), tableController.create);
router.put('/:id',  authMiddleware, roleMiddleware('admin'), tableController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), tableController.remove);

export default router;
