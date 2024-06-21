import { BaseResponse } from "./baseResponse";
import { courseWisePaymentVM } from "./courseWisePaymentVM";

export interface courseWisePaymentsResponseVM extends BaseResponse{
    content ?: courseWisePaymentVM[];
}