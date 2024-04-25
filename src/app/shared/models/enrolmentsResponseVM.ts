import { BaseResponse } from "./baseResponse";
import { EnrolmentVM } from "./enrolmentVM";

export interface EnrolmentsResponse extends BaseResponse{
    content : EnrolmentVM;
}