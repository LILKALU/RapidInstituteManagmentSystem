import { approvingStatusVM } from "./approvingStatusVM";
import { BaseResponse } from "./baseResponse";

export interface approvingStatusesResponseVM extends BaseResponse{
    content : approvingStatusVM[];
}