import { roleVM } from "./roleVM";

export interface teacherVM{
    id ?: number;
    tcode ?: string;
    fullName ?: string;
    title ?: string;
    highestQulification ?: string;
    birthday ?: string;
    isActive ?: boolean;
	contactNumber ?: string;
	email ?: string;
    role ?: roleVM
}