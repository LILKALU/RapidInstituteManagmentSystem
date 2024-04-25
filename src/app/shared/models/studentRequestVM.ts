import { addressVM } from "./addressVM";
import { parentVM } from "./parentVM";

export interface studentRequestVM{
    fullName : string;
    callingName : string;
    birthDay : string;
    gender : string;
    isActive : boolean;
    contactNumber : string;
    address : addressVM;
    parent : parentVM;

}