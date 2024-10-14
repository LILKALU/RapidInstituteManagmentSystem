import { BaseResponse } from "./baseResponse";
import { DeleteAvailabilityVM } from "./deleteAvailabilityVM";

export interface DeleteAvailabilityResponseVM extends BaseResponse{
    content : DeleteAvailabilityVM
}