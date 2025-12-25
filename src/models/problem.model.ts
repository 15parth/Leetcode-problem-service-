import mongoose, { Document } from "mongoose";

export interface ITestCase{
    input: string;
    output:string
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty : "easy" | "medium" | "hard";
    createdAt : Date;
    updatedAt: Date;
    editorial?: string;
    testCases: ITestCase[];
}

 
 const testCaseSchema = new mongoose.Schema<ITestCase>({
    input:{
        type:String,
        required:[true,"Input is required"],
        trim:true
    },
    output:{
        type:String,
        required:[true,"Output is required"],
        trim:true
    }
 })

 const problemSchema = new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,'Title is required'],
        maxLength:[100,'Title must me less than 100 characters'],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true
    },
    difficulty:{
        type:String,
        enum:{
            values: ["easy", "medium", "hard"],
            message:"Invalid difficulty level"
        },
        default:"easy",
        required:[true,"Difficult level is required"]
    },
    editorial:{
        type:String,
        trim:true,

    },
    testCases:[testCaseSchema]
 },{
    timestamps:true
 });


 problemSchema.index({title : 1}, {unique: true});
 problemSchema.index({difficulty:1})


 export const Problem = mongoose.model<IProblem>("Problem", problemSchema)