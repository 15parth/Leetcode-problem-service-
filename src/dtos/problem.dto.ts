import { ITestCase } from "../models/problem.model";

export interface CreateProblemDto{
    title: string;
    description: string;
    difficulty:"easy" | "medium" | "hard";
    editorial?:string;
    testCase?:ITestCase[]
}

export interface UpdateProblemDto extends CreateProblemDto {}