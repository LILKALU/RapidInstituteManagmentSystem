import { privilagesVM } from "./privilagesVM";

export interface loginDetailsVM{
    isLoginSuccess : boolean;
    id : number;
    usercode : string;
    fullName : string;
    privilagesDTO : privilagesVM[]
}