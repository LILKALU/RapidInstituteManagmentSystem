import { BaseResponse } from "./baseResponse";
import { roleVM } from "./roleVM";

export interface roleResponseVM extends BaseResponse{
    content ?: roleVM;
}