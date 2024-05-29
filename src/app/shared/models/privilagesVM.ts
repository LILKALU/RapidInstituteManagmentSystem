import { actionVM } from "./actionVM";
import { appIconVM } from "./appIconVM";
import { roleVM } from "./roleVM";

export interface privilagesVM {
    role : roleVM;
    appIcon : appIconVM;
    action : actionVM;
    isActive : boolean;
}