import { BaseResponse } from "./baseResponse";
import { ClassFeeVM } from "./classFeeVM";

export interface classFeesResponse extends BaseResponse{
    content : ClassFeeVM[];
}