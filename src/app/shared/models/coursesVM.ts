import { GradeVM } from "./gradeVM";
import { HallVM } from "./hallVM";
import { SubjectVM } from "./subjectVM";
import { teacherVM } from "./teachersVM";

export interface CourseVM{
    id ?: number;
    grade : GradeVM;
    subject : SubjectVM;
    teacher : teacherVM;
    hall : HallVM;
    date : string;
    startTime : string;
    endTime : string;
    classFeeAmount : number;
    isActive : boolean;
    code ?: string;
    styleClassName ?: string[];
}