import { BaseResponse } from "./baseResponse";
import { MonthVM } from "./monthVM";

export interface MonthsResponseVM extends BaseResponse{
    content : MonthVM[];
}