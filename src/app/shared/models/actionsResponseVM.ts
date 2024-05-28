import { actionVM } from "./actionVM";
import { BaseResponse } from "./baseResponse";

export interface actionsResponseVM extends BaseResponse{
    content : actionVM[];
}