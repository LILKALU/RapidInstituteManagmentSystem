import { BaseResponse } from "./baseResponse";
import { studentVM } from "./studentVM";

export interface studentAllResponseVM extends BaseResponse{
    content : studentVM[];
}