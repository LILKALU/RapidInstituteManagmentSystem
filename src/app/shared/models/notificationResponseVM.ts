import { BaseResponse } from "./baseResponse";
import { notificationVM } from "./notificationVM";

export interface notificationResponseVM extends BaseResponse{
    content ?: notificationVM;
}