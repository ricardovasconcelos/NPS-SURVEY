import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

  async execute(request: Request, response: Response){
    const { email, survey_id } =  request.body 

    const usersRepository = getCustomRepository(UsersRepository);
    const surversRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepository.findOne({email})
    const survey = await surversRepository.findOne({
      id: survey_id
    })

    if(!user){
      return response.status(400).json({
        error: "User does not exists"
      })
    }

    if(!survey){
      return response.status(400).json({
        error: "Survey does not exists"
      })
    }

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }

    const npspath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surverUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null}],
      relations: ["user", "survey"]
    })

    if(surverUserAlreadyExists){
      await SendMailService.execute(email, survey.title, variables, npspath)
      return response.json(surverUserAlreadyExists)
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    })

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, variables, npspath)

    return response.json(surveyUser)

  }

}

export { SendMailController };
