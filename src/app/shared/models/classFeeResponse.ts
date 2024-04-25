import { BaseResponse } from "./baseResponse";
import { ClassFeeVM } from "./classFeeVM";

export interface classFeeResponse extends BaseResponse{
    content : ClassFeeVM;
}