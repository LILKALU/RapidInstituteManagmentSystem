import { BaseResponse } from "./baseResponse";
import { courseWiseStudentCountVM } from "./courseWiseStudentCountVM";

export interface courseWiseStudentCountsResponseVM  extends BaseResponse{
    content : courseWiseStudentCountVM[]
}