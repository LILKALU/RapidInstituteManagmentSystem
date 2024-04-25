import { BaseResponse } from "./baseResponse";
import { HallVM } from "./hallVM";

export interface HallsResponseVM extends BaseResponse{
    content : HallVM[];
}