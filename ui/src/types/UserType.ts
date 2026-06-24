// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type UserRole = "SuperUser" | "Executive" | "Analyst";
export type User = {
    Id: string;
    Role: UserRole;
    FirstName?: string;
    LastName?: string
    Title?: string;
    Username?: string;
    Email?: string;
    Token?: string;
}