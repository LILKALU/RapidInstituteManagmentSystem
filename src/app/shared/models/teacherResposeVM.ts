import { BaseResponse } from "./baseResponse";
import { teacherVM } from "./teachersVM";

export interface TeacherResponse extends BaseResponse{
    content : teacherVM;
}