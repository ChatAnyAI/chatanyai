import {get, Pagination, post, put} from "@/lib/request";
import {AppType, AppVisibility, ProductType, UserRole, UserStatus} from "@/lib/constants/constants";
import {UserFormValues} from "@/app/admin/teamMember/components/edit-member";
import {AppFormValues} from "@/app/admin/application/components/edit-app";
import {ProviderFormValues} from "@/app/admin/modelProvider/components/config-panel";


export interface RespModelProviderInfo {
    id: number;
    name: string;
    icon: string;
    apiKey: string;
    apiHost: string;
    enabled: number;
    keepAliveTime: number;
    modelList: ModelInfo[];
}

export interface ModelInfo {
    modelId: string;
    modelName: string;
    enabled: number;
}

export const ApiAdminModelProviderList = () => {
    return get<RespModelProviderInfo[]>('/api/admin/aiModel/-/allList');
}

// /api/admin/statistics/total
export interface RespApiAdminStatisticsTotal {
    applicationCount: number;
    userCount: number;
    chatCount: number;
    datasetCount: number;
    copilotCount: number;
    toolCount: number;
    modelProviderCount: number;
    messageCount: number;
    fileCount: number;
    activeUserCount: number;
}

export const ApiAdminStatisticsTotal = () => {
    return get<RespApiAdminStatisticsTotal>('/api/admin/statistics/total');
}

export interface RespApiAdminApplicationListItem {
    id: number;
    name: string;
    description: string;
    icon: string;
    type: AppType;
    subType: number;
    activityCount: number;
    visibility: AppVisibility;
    enabled: number;
    createdAt: number;
    activityAt: number;
}
export interface RespApiAdminApplicationListTotal {
    applicationCount: number;
    datasetCount: number;
    copilotCount: number;
    toolCount: number;
}

export interface RespApiAdminApplicationList {
    list: RespApiAdminApplicationListItem[];
    pagination: Pagination;
    total: RespApiAdminApplicationListTotal;
}

export type RespApiAdminApplicationListRequest = {
    name: string;
    pagination: Pagination;
}

// /api/admin/application/-/list
export const ApiAdminApplicationList = (params: RespApiAdminApplicationListRequest) => {
    return get<RespApiAdminApplicationList>('/api/admin/application/-/list', {
        params: {
            ...params,
            pagination: JSON.stringify(params.pagination)
        },
    });
}

export interface RespApiAdminTeamMemberListItem {
    teamMemberId: number;
    name: string;
    avatar: string;
    email: string;
    roleId: UserRole;
    status: UserStatus;
    createdAt: number;
    activityAt: number;
}
export interface RespApiAdminTeamMemberListTotal {
    count: number;
    activeCount: number;
    blockCount: number;
    adminCount: number;
}

export interface RespApiAdminTeamMemberList {
    list: RespApiAdminTeamMemberListItem[];
    pagination: Pagination;
    total: RespApiAdminTeamMemberListTotal;
}

export type ApiAdminTeamMemberListRequest = {
    name: string;
    pagination: Pagination;
}

export const ApiAdminTeamMemberList = (params: ApiAdminTeamMemberListRequest) => {
    return get<RespApiAdminTeamMemberList>('/api/admin/teamMember/-/list', {
        params: {
            ...params,
            pagination: JSON.stringify(params.pagination)
        },
    });
}

export interface ApiAdminUserCreateRequest {
    name: string;
    password: string;
    role: UserRole;
}

export const ApiAdminUserCreate = (req: ApiAdminUserCreateRequest) => {
    return post<void>(`/api/admin/user/-/create`,req);
}


export interface ApiAdminUserUpdateRequest {
    name: string;
    password: string;
    role: UserRole;
}

export const ApiAdminUserUpdate = (teamMemberId: number, req: UserFormValues) => {
    return put<void>(`/api/admin/teamMember/${teamMemberId}`,req);
}


export const ApiAdminAppUpdate = (appId: number, req: AppFormValues) => {
    return put<void>(`/api/admin/application/${appId}`,req);
}

export const ApiAdminProviderUpdate = (providerId: number, req: ProviderFormValues) => {
    return put<void>(`/api/admin/aiModel/${providerId}`,req);
}



export interface ApiAdminTeamLicenseResp {
    licenseId: string;
    licenseIssuedTo: string;
    licenseIssuedTime: number;
    licenseExpirationTime: number;
    licenseProduct: ProductType;
    licenseVersion: string;
    licenseMaxUsers: number;
    licenseMaxInstances: number;
    licenseAllowedDomains: string[];
    staticActiveUsers: number;
}

export const ApiAdminTeamLicense = () => {
    return get<ApiAdminTeamLicenseResp>(`/api/admin/team/license`);
}


export interface ApiUpdateAdminTeamLicenseRequest {
    license: string;
}

export const ApiUpdateAdminTeamLicense = (req: ApiUpdateAdminTeamLicenseRequest) => {
    return put<void>(`/api/admin/team/license`,req);
}

