import { BaseResponse } from "./baseResponse";
import { SubjectVM } from "./subjectVM";

export interface SubjectResponseVM extends BaseResponse{
    content : SubjectVM;
}