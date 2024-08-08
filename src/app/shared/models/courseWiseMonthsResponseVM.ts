import { BaseResponse } from "./baseResponse";
import { courseWiseMonths } from "./courseWiseMonthsVM";

export interface courseWiseMonthsResponseVM extends BaseResponse{
    content ?: courseWiseMonths[];
}