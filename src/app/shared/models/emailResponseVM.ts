import { BaseResponse } from "./baseResponse";

export interface emailResponseVM extends BaseResponse{
    content ?: string;
}