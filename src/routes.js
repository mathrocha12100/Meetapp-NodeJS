import { Router } from 'express';
import multer from 'multer';
import authMiddleware from './app/middlewares/authMiddleware';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizingController from './app/controllers/OrganizingController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.get('/users/:id', UserController.index);

routes.post('/session', SessionController.store);
routes.use(authMiddleware);

routes.put('/session/update', UserController.update);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups/update/:id', MeetupController.update);
routes.get('/organizers', OrganizingController.index);
routes.delete('/meetups/:id', MeetupController.delete);
routes.get('/meetups', MeetupController.index);

routes.post('/subscriptions/:meetup_id', SubscriptionController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
