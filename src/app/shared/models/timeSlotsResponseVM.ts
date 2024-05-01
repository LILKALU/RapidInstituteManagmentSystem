import { BaseResponse } from "./baseResponse";
import { timeSlotVM } from "./timeSlotVM";

export interface timeSlotsResponse extends BaseResponse{
    content : timeSlotVM[];
}