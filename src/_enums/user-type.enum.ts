export enum UserType {
    SYNDICATE_LEAD = "syndicate_lead",
    SYNDICATE_MEMBER = "syndicate_member",
    STARTUP_FOUNDER = "startup_founder",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}

// may above enums into an array
export const UserTypeArray: UserType[] = Object.values(UserType);