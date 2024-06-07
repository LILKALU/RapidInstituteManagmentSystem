import { BaseResponse } from "./baseResponse";
import { otherEmployeeVM } from "./oterEmployeeVM";

export interface otherEmployeeResponseVM extends BaseResponse{
    content : otherEmployeeVM;
}