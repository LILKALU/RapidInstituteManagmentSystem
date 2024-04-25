import { BaseResponse } from "./baseResponse";
import { HallVM } from "./hallVM";

export interface hallResponse extends BaseResponse{
    content : HallVM;
}