
import { appIconVM } from "./appIconVM";
import { BaseResponse } from "./baseResponse";

export interface appiconResponse extends BaseResponse{
    content ?: appIconVM;
}