import { BaseResponse } from "./baseResponse";
import { studentVM } from "./studentVM";

export interface studentResponseVM extends BaseResponse{
    content : studentVM
}