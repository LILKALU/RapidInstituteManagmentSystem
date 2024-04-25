import { BaseResponse } from "./baseResponse";
import { parentVM } from "./parentVM";

export interface parentResponseVM extends BaseResponse{
    content ?: parentVM;
}