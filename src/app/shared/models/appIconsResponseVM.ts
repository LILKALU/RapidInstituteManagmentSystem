
import { appIconVM } from "./appIconVM";
import { BaseResponse } from "./baseResponse";

export interface appiconsResponse extends BaseResponse{
    content ?: appIconVM[];
}