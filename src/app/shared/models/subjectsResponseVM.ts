import { BaseResponse } from "./baseResponse";
import { SubjectVM } from "./subjectVM";

export interface SubjectsResponseVM extends BaseResponse{
    content : SubjectVM[];
}