import { BaseResponse } from "./baseResponse";
import { leaveRequestVM } from "./leaveRequestVM";

export interface leaveRequestResponseVM extends BaseResponse{
    content : leaveRequestVM;
}