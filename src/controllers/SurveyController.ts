import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveyController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepositories = getCustomRepository(SurveysRepository);

    const survey = surveysRepositories.create({
      title,
      description,
    });

    await surveysRepositories.save(survey)
   
    return response.status(201).json(survey)
  }

  async show(request: Request, response: Response){
    const surveysRepository = getCustomRepository(SurveysRepository)

    const all = await surveysRepository.find()

    return response.json(all)
  }
}

export { SurveyController };
