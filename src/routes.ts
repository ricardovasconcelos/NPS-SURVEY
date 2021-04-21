import { Router } from 'express'
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const usersController = new UserController()
const surveysController = new SurveyController()
const sendMailController = new SendMailController()

router.post('/users', usersController.create)

router.post('/surveys', surveysController.create)
router.get('/surveys', surveysController.show)

router.post('/sendMail', sendMailController.execute)

export { router }