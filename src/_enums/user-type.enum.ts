export enum UserType {
    FOUNDER = "founder",
    SYNDICATE_INVESTOR = "syndicate_investor",
    SYNDICATE_LEAD = "syndicate_lead",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}

// may above enums into an array
export const UserTypeArray: UserType[] = Object.values(UserType);