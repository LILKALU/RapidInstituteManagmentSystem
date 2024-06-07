import { BaseResponse } from "./baseResponse";
import { otherEmployeeVM } from "./oterEmployeeVM";

export interface otherEmployeesResponseVM extends BaseResponse{
    content : otherEmployeeVM[];
}