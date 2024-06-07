import { roleVM } from "./roleVM";

export interface otherEmployeeVM{
    id ?: number;
    roleId ?: number;
    mcode ?: string;
    fcode ?: string;
    syscode ?: string;
    fullName ?: string;
    title ?: string
    contactNumber ?: string;
    email ?: string;
    role ?: roleVM
}