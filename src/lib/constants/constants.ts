

import { BotMessageSquare, Database, FileText, BrainCircuit } from "lucide-react"

export enum AppType {
    KnowledgeBase = 1,
    Copilot = 2,
    ChatPDF = 3,
    MeetingChat = 4,
}

export enum AppSubType {
    ToolChatPDF = 1,
    ToolMeeting = 2,
}

export enum AppVisibility {
    Private = 1,
    Internal = 2,
    Public = 3,
}

export const AppVisibilityEnum = {
    [AppVisibility.Private]: 'Private',
    [AppVisibility.Internal]: 'Internal',
    [AppVisibility.Public]: 'Public',
}

export const AppLabelEnum = {
    [AppType.KnowledgeBase]: 'KnowledgeBase',
    [AppType.Copilot]: 'Copilot',
    [AppType.ChatPDF]: 'ChatPDF',
    [AppType.MeetingChat]: 'Brainstorm',
}


export const RouteEnum = {
    [AppType.KnowledgeBase]: 's',
    [AppType.Copilot]: 's',
    [AppType.ChatPDF]: 'chatpdf',
    [AppType.MeetingChat]: 'meeting',
}

export enum UserStatus {
    Unknown = 0,
    Active = 1,
    Blocked = 2,
}

export const UserStatusEnum = {
    [UserStatus.Unknown]: 'Unknown',
    [UserStatus.Active]: 'Active',
    [UserStatus.Blocked]: 'Blocked',
}

export enum UserRole {
    Unknown = 0,
    Normal = 1,
    Admin = 2,
    Editor = 3,
}

export const UserRoleEnum = {
    [UserRole.Unknown]: 'Unknown',
    [UserRole.Normal]: 'Normal',
    [UserRole.Admin]: 'Admin',
    [UserRole.Editor]: 'Editor',
}

export enum ProductType {
    Unknown = 0,
    Trial = 1,
    Professional = 2,
    Enterprise = 3,
}

export const ProductTypeEnum = {
    [ProductType.Unknown]: 'Unknown',
    [ProductType.Trial]: 'Free Trial',
    [ProductType.Professional]: 'Professional',
    [ProductType.Enterprise]: 'Enterprise',
}


export const AppIcons = {
    [AppType.Copilot]: {
        icon: BotMessageSquare,
        color: "#ff9800"
    },
    [AppType.ChatPDF]: {
        icon: FileText,
        color: "#4285f4"
    },
    [AppType.KnowledgeBase]: {
        icon: Database,
        color: "#0f9d58"
    },
    [AppType.MeetingChat]: {
        icon: BrainCircuit,
        color: "#9c27b0"
    }
};