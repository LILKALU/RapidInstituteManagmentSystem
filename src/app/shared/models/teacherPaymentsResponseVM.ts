import { BaseResponse } from "./baseResponse";
import { teacherPayemntVM } from "./teacherPaymentVM";

export interface teacherPaymentsResponseVM extends BaseResponse{
    content : teacherPayemntVM[];
}