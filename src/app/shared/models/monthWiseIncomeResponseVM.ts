import { BaseResponse } from "./baseResponse";
import { monthWiseIncomeVM } from "./monthWiseIncomeVM";

export interface monthWiseIncomesResponseVM extends BaseResponse{
    content : monthWiseIncomeVM[];
}