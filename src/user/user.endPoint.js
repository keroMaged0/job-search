import { systemRoles } from "../../utils/system-roles.js";


export const endPointRoles = {
    ADMIN_C_HR: [systemRoles.ADMIN, systemRoles.C_HR],
    ADMIN: [systemRoles.ADMIN],
    ALL: [systemRoles.ADMIN, systemRoles.C_HR, systemRoles.USER],
    USER: [systemRoles.USER]
}