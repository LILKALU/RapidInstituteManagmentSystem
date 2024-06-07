import { addressVM } from "./addressVM";
import { parentVM } from "./parentVM";
import { roleVM } from "./roleVM";

export interface studentVM{
    id ?: number;
    scode ?: string;
    fullName ?: string;
    callingName ?: string;
    birthDay ?: string;
    gender ?: string;
    isActive ?: boolean;
    contactNumber ?: string;
    address ?: addressVM;
    parent ?: parentVM;
    school ?: string;
    isAdmisionPaid ?: boolean;
    email ?: string;
    role ?: roleVM;
}