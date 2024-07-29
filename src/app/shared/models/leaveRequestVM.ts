import { approvingStatusVM } from "./approvingStatusVM";
import { teacherVM } from "./teachersVM";

export interface leaveRequestVM{
    id ?: number;
    teacher ?: teacherVM;
    requestedDate ?: string;
    approvingStatus ?: approvingStatusVM;
    officerUserCode ?: string;
    createdDateTime ?: string;
    leaveReason ?: string;
    isActive ?: boolean;
}