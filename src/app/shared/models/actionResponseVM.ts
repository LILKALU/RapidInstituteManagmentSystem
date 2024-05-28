import { actionVM } from "./actionVM";
import { BaseResponse } from "./baseResponse";

export interface actionResponseVM extends BaseResponse{
    content : actionVM;
}