import { attendanceVM } from "./attendanceVM";
import { BaseResponse } from "./baseResponse";

export interface attendancesResponseVM extends BaseResponse{
    content ?: attendanceVM[];
}