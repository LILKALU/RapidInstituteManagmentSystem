import { BaseResponse } from "./baseResponse";
import { courseWiseMonth } from "./courseWiseMonthVM";

export interface courseWiseMonthResponse extends BaseResponse{
    content ?: courseWiseMonth[];
}