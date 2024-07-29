import { BaseResponse } from "./baseResponse";
import { leaveRequestVM } from "./leaveRequestVM";

export interface leaveRequestsResponseVM extends BaseResponse{
    content : leaveRequestVM[];
}