import { BaseResponse } from "./baseResponse";
import { EnrolmentVM } from "./enrolmentVM";

export interface EnrolmentsResponses extends BaseResponse{
    content : EnrolmentVM[];
}