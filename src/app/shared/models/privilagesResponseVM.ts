import { BaseResponse } from "./baseResponse";
import { privilagesVM } from "./privilagesVM";

export interface privilagesResponse extends BaseResponse{
    content : privilagesVM[];
}