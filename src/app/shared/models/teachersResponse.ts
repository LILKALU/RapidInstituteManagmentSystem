import { BaseResponse } from "./baseResponse";
import { teacherVM } from "./teachersVM";

export interface TeachersResponse extends BaseResponse{
    content : teacherVM[];
}