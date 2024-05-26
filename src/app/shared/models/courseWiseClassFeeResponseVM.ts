import { BaseResponse } from "./baseResponse";
import { courseWiseClassFeeVM } from "./courseWiseClassFeeVM";

export interface courseWiseClassFeeResponseVM extends BaseResponse{
    content ?: courseWiseClassFeeVM[];
}