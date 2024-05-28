import { BaseResponse } from "./baseResponse";
import { roleVM } from "./roleVM";

export interface rolesResponseVM extends BaseResponse{
    content ?: roleVM[];
}