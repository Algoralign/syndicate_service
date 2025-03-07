export enum UserType {
    OTHERS = "others",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}

// may above enums into an array
export const UserTypeArray: UserType[] = Object.values(UserType);