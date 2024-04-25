import { ADAccountVM } from "./adAccountVM";
import { BaseResponse } from "./baseResponse";

export interface ADAccountResponseVM extends BaseResponse{
    content ?: ADAccountVM;
}