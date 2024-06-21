import { BaseResponse } from "./baseResponse";
import { teacherPayemntVM } from "./teacherPaymentVM";

export interface teacherPaymentResponseVM extends BaseResponse{
    content : teacherPayemntVM;
}