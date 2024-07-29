import { BaseResponse } from "./baseResponse";
import { notificationVM } from "./notificationVM";

export interface notificationResponsesVM extends BaseResponse{
    content ?: notificationVM[];
}