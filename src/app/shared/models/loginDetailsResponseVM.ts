import { BaseResponse } from "./baseResponse";
import { loginDetailsVM } from "./loginDetailsVM";

export interface loginDetailsResponseVM extends BaseResponse{
    content : loginDetailsVM;
}