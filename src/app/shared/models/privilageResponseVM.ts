import { BaseResponse } from "./baseResponse";
import { privilagesVM } from "./privilagesVM";

export interface privilageResponse extends BaseResponse{
    content : privilagesVM;
}