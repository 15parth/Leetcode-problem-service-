import { IProblemRepository, ProblemRepository } from './../repositories/problem.repository';
import {CreateProblemDto, UpdateProblemDto } from "../dtos/problem.dto";
import { IProblem } from "../models/problem.model";
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';
import { sanitizeMarkdown } from '../utils/markdown.sanitizor';

export interface IProblemService {
createProblem (problem: CreateProblemDto): Promise<IProblem>;
getProblemById(id: string): Promise<IProblem | null>;
getAllProblems (): Promise<{ problems: IProblem [], total: number}>;
updateProblem (id: string, updateData :UpdateProblemDto): Promise<IProblem | null>;
deleteProblem(id: string): Promise<boolean>;
findByDifficulty (difficulty: "easy" | "medium" | "hard"): Promise<IProblem []>;
searchProblems (query: string): Promise<IProblem []>;
}

export class ProblemService implements IProblemService {

    private ProblemRepository:IProblemRepository;

    constructor(ProblemRepository: IProblemRepository){
        this.ProblemRepository= ProblemRepository;
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {

        const sanizedPayload={
             ...problem,
             description: await sanitizeMarkdown(problem.description),
             editorial: problem.editorial && sanitizeMarkdown(problem.editorial)
        }

        return await this.ProblemRepository.createProblem(sanizedPayload);
    }

    async  getProblemById(id: string): Promise<IProblem | null> {

        const problem = await this.ProblemRepository.getProblemById(id);

        if(!problem){
            throw new NotFoundError("Problem with the given Id not found");

        }
        
        return problem;

    }

   async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
        
        const problems = await this.ProblemRepository.getAllProblems();

        if(!problems){
            throw new NotFoundError("Currently there are not problems present");

        }
        
        return problems;
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {

        const problem = await this.ProblemRepository.getProblemById(id);

        if (!problem) {
            throw new NotFoundError("Problem with the given Id not found");

        }

        const sanitizedPayload : Partial<IProblem>={
            ...updateData
        }

        if(updateData.description){
            sanitizedPayload.description= await sanitizeMarkdown(sanitizedPayload.description)
        }

        if(updateData.editorial){
            sanitizedPayload.editorial = await sanitizeMarkdown(sanitizedPayload.editorial)
        }

        return await this.ProblemRepository.updateProblem(id, updateData);

    }

    async deleteProblem(id: string): Promise<boolean> {
        const result  = await this.ProblemRepository.deleteProblem(id);

        if(!result){
            throw new NotFoundError('Problem not found');
        }

        return result!==null;

    }

    async findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<IProblem[]> {
        return await this.ProblemRepository.findByDifficulty(difficulty)
    }

    async searchProblems(query: string): Promise<IProblem[]> {

        if(!query && query.trim()===""){
            throw new BadRequestError("Query is required");
        }

        return await this.ProblemRepository.searchProblem(query)
    }



}