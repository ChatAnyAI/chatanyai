import { get, post, del, put } from "@/lib/request";
import {AppSubType, AppType, AppVisibility, ProductType, UserRole} from "@/lib/constants/constants";

// Common Types
export interface Resp<T> {
  code: number;
  message: string;
  data: T;
}

export interface Pagination {
  total?: number;
  currentPage: number;
  pageSize: number;
  sort?: string;
}

// Define new interface with pagination property
export interface ResponseWithPagination<T> {
  list: T;
  pagination: Pagination;
}



export interface RespPage {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: number;
}

// User APIs
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
  login_type: string;
}

export interface LoginResponse {
  token: string;
}

export const ApiUserRegister = (data: RegisterRequest) => {
  return post<void>('/api/user/register', data);
}

export const ApiUserLogin = (data: LoginRequest) => {
  return post<LoginResponse>('/api/user/login', data);
}

export const ApiUserLogout = () => {
  return get<void>('/api/user/logout');
}

export interface TeamMemberDto {
  teamId: number;
  name: string;
  activityAt: number;
  headerLogo: string;
  favicon: string;
  systemHeader: string;
  systemFooter: string;
  productId: ProductType;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AvatarUser {
    name: string;
    avatar: string;
}

export interface UserProfile extends User {
  roleId: UserRole;  // Assuming consts.UserRole is a number type
  teams: TeamMemberDto[];
  currentTeamId: number;
  currentTeam: TeamMemberDto;
}

export enum FileFormat {
  FileUnknown,
  DocumentSlate,
  DocumentMarkdown,
  FileImg,
  FilePDF,
  FileDoc,
  FileXLS,
  FilePPT,
  FileMP3,
  FileMP4,
  FileZIP
}

export interface FileResp {
  id: string;
  spaceGuid: string;
  name: string;
  contentKey: string;
  fileFormat: FileFormat;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  hash: string;
  uid: number;
  teamId: number;
}

export const ApiFileRecent = (data: { pagination: Pagination }) => {
  return get<ResponseWithPagination<FileResp[]>>('/api/file/recent', {
    params: {
      pagination: JSON.stringify(data.pagination)
    }
  });
}

export type Space = {
  id: number;
  uid: number;
  teamId: number;
  appId: string;
  weight: number;
  createdBy: number;
  createdAt: number;
}
export const ApiSpaceList = () => {
  return get<Array<Space & {
    app: AppResp;
  }>>('/api/space/list');
}

export interface SpaceChangeSortReq {
  dropPosition: string;
  spaceGuid: string;
  targetSpaceGuid: string;
}
export const ApiSpaceDrag = (data: SpaceChangeSortReq) => {
  return put('/api/space/-/changeSort', data);
}


// App APIs
export interface AppResp {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AppType; // Assuming AppType is already defined in your constants
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  activityAt: number;
  activityCount: number;
  createdBy: number;
  copilotPrompt: string;
  datasetSource: 1 | 2 | 3; // Assuming DatasetSource is already defined in your constants
  enabled: number;
  visibility: 1 | 2; // Assuming Visibility is already defined in your constants
  teamId: number;
  providerModel: string;
}

export const ApiAppFavoriteList = () => {
  return get<AppResp[]>('/api/app/favorite');
}

export const ApiAppFavoriteAdd = (appId: string) => {
  return post<void>(`/api/app/favorite/${appId}`);
}

export const ApiAppFavoriteDelete = (appId: string) => {
  return del<void>(`/api/app/favorite/${appId}`);
}


export type ExploreListRequest = {
  name: string;
  pagination: Pagination;
}
export const ApiAppExploreList = (type: number, params: ExploreListRequest) => {
  return get<ResponseWithPagination<AppResp[]>>(`/api/app/explore/${type}`, {
    params: {
      ...params,
      pagination: JSON.stringify(params.pagination)
    },
  });
}

export const ApiUpdateVisibility = (appId: string, visibility: AppVisibility) => {
  return put<void>(`/api/app/${appId}/visibility`, { visibility });
}

export interface UpdateAppInfoRequest {
  name: string;
  description?: string;
  icon?: string;
  copilotPrompt?: string;
  datasetSource?: 1 | 2 | 3; // Assuming DatasetSource is already defined in your constants
  visibility?: 1 | 2; // Assuming Visibility is already defined in your constants
  fileIds?: string[];
}
export const ApiUpdateAppInfo = (appId: string, data: UpdateAppInfoRequest) => {
  return put<void>(`/api/app/${appId}/info`, data);
}

export const ApiShareWithMeList = () => {
  return get<Array<{ app?: AppResp, chat?: RespChat, fromUser: User }>>('/api/share/-/list');
}

export const ApiAppShareCreate = (appId: string, uids: number[]) => {
  return put<void>(`/api/app/${appId}/share`, { uids });
}

export const ApiAppShareDelete = (appId: string, uid: number) => {
  return del<void>(`/api/app/${appId}/share/${uid}`);
}

export const ApiAppShareUserList = (appId: string) => {
  return get<User[]>(`/api/app/${appId}/share/userList`);
}
export const ApiAppList = () => {
  return get<AppResp[]>(`/api/app/list`);
}
export const ApiAppInfo = (appId: string) => {
  return get<AppResp>(`/api/app/${appId}/info`);
}
export const ApiAllUserList = () => {
  return get<User[]>(`/api/team/users`);
}

// exclude dataset and copilot
export const ApiAppCreate = (data: Omit<CreateCopilotRequest, 'copilotPrompt'> & { type: AppType }) => {
  return post<{ guid: string }>('/api/app', data);
}

export const ApiTeamUsers = () => {
  return get<User[]>(`/api/team/users`);
}



// /api/home/recent
export type ApiHomeRecentRes = {
  appList: ApiHomeRecentAppItem[]
  chatList: ApiHomeRecentChatItem[]
}

export type ApiHomeRecentAppItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AppType;
  subType: AppSubType;
  updatedAt: number;
  visibility: AppVisibility;
}

export type ApiHomeRecentChatItem = {
  id: string;
  title: string;
  msgCount: number;
  updatedAt: number;
  appId: string;
  uid: number;
  appName: string;
  icon: string;
  type: AppType;
  subType: AppSubType;
  visibility: AppVisibility;
  collaborators: Collaborator[];
}

export type Collaborator = {
    uid: number;
    name: string;
    email: string;
    avatar: string;
}


export const ApiHomeRecent = () => {
  return get<ApiHomeRecentRes>('/api/home/recent');
}

// Dataset APIs
export interface CreateDatasetRequest {
  title: string;
  icon?: string;
  description?: string;
  fileIds?: string[];
}

export interface UpdateDatasetRequest {
  title?: string;
  fileIds?: string[];
}

export const ApiKnowledgeCreate = (data: CreateDatasetRequest) => {
  return post<{ guid: string }>('/api/knowledge', data);
}

export const ApiDatasetUpdate = (datasetId: string, data: UpdateDatasetRequest) => {
  return put<void>(`/api/dataset/${datasetId}/info`, data);
}

export const ApiDatasetDelete = (datasetId: string) => {
  return del<void>(`/api/dataset/${datasetId}/info`);
}


export interface RespDatasetInfo {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  uid: number;
  source: number;  // DatasetSource enum
  fileCnt: number;
}

export const ApiDatasetList = () => {
  return get<RespDatasetInfo[]>('/api/dataset/-/list');
}

export const ApiDatasetInfo = (id: string) => {
  return get<RespDatasetInfo>(`/api/dataset/${id}/info`);
}

export interface RespDocumentInfo {
  fileId: string;
  name: string;
  createdAt: number;
  embedStatus: number; // 0: pending, 1: processing, 2: completed, 3: failed}
}


export const ApiDatasetDocumentList = (id: string) => {
  return get<ResponseWithPagination<RespDocumentInfo[]>>(`/api/dataset/${id}/document/-/list`);
}

export interface VectorEmbedding {
  uuid: string;
  datasetId: string;
  fileId: string;
  embedding: number[]; // Vector type is represented as number array
  content: string;     // renamed from Document to avoid confusion with DOM Document
  createdAt: number;
  wordCount: number;
  createdBy: number;
  enabled: number;     // using number instead of int8
};

export const ApiDatasetDocumentPageList = (datasetId: string, fileId: string) => {
  return get<ResponseWithPagination<VectorEmbedding[]>>(`/api/dataset/${datasetId}/document/${fileId}/page/-/list`);
}

// Drive APIs
export interface DriveCreateResponse {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
}

export const ApiDriveUpload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return post<DriveCreateResponse>('/api/files/upload', formData);
}

// Chat APIs
export interface PostChatRequest {
  id: string;
  appId: string;
  messages: PostChatMessage[];
  modelId: string;
  pdfLink?: string;
  options: {
    temperature?: number;
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
  }
}

export interface PostChatMessage {
  role: string;
  content: string;
  experimental_attachments?: PostChatMessageAttachment[];
}

export interface PostChatMessageAttachment {
  url: string;
  name: string;
  contentType: string;
}

export const ApiPostChat = (data: PostChatRequest) => {
  return post<void>(`/api/app/${data.appId}/chat/${data.id}`, data);
}


export interface RespChat {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  appId: string;
  title: string;
  uid: number;
  visibility: AppVisibility;
  pdfLink: string;
  type: AppType;
}
export const ApiGetChat = (chatId: string) => {
  return get<RespChat>(`/api/chat/${chatId}`);
}

export interface RespChatHistoryMessage {
  id: string;
  chatId: string;
  role: string;
  content: string;
  ragContent: string;
  attachments: PostChatMessageAttachment[]; // Reuse existing PostChatMessageAttachment interface
  createdAt: number;
  user: User;
}

export const ApiChatHistory = (chatId: string) => {
  return get<RespChatHistoryMessage[]>(`/api/chat/${chatId}/history`);
}

export interface UpdateChatInfoRequest {
  title?: string;
  visibility?: number;
}

export const ApiUpdateChatInfo = (chatId: string, data: UpdateChatInfoRequest) => {
  return put<void>(`/api/chat/${chatId}/info`, data);
}

export const ApiChatListByAppId = (appId: string) => {
  return get<RespChat[]>(`/api/app/${appId}/chat/-/list`);
}

export const ApiChatShareList = (chatId: string) => {
  return get<User[]>(`/api/chat/${chatId}/share/-/userList`);
}

export const ApiChatShareCreate = (chatId: string, uids: number[]) => {
  return put<void>(`/api/chat/${chatId}/share`, { uids });
}

export const ApiChatShareDelete = (chatId: string, uid: number) => {
  return del<void>(`/api/chat/${chatId}/share/${uid}`);
}


export interface MeetingMember {
  name: string;
  description: string;
}
export interface MeetingRequest {
  maxRounds: number;
  members: MeetingMember[];
  messages: PostChatMessage[];
  id: string;      // chatId
  appId: string;
  topic: string;   // meeting topic
  modelId: string;
  options: Record<string, any>;
  // pdfLink?: string;
}

export const ApiMeetingCreate = (data: MeetingRequest) => {
  return post<void>(`/api/app/${data.appId}/chat/${data.id}/meeting`, data);
}


export const ApiStreamChat = () => {
  return get<void>('/api/stream');
}

export const ApiStreamChatOllama = () => {
  return get<void>('/api/streamOllama');
}

export const ApiMultiStreamChatOllama = () => {
  return get<void>('/api/multiStreamOllama');
}

export type RespModel = {
  label: string;
  icon: string;
  model: string;
}
export const ApiAiModelList = () => {
  return get<RespModel[]>('/api/aiModel/-/list');
}

export const ApiTestChat = () => {
  return get<void>('/api/testChat');
}

// File Upload APIs
export interface DatasetCreateResponse {
  fileIds: string[];
}

export const ApiDatasetUpload = (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('file', file);
  });
  return post<DatasetCreateResponse>('/api/files/upload/dataset', formData);
}




// copilot APIs
export interface CreateCopilotRequest {
  name: string;
  description: string;
  icon: string;
  copilotPrompt: string;
}

// copilot APIs
export const ApiCopilotCreate = (data: CreateCopilotRequest) => {
  return post<{ guid: string }>('/api/copilot', data);
}

export interface Template {
  id: number;
  type: AppType; // Assuming AppType is already defined in your constants
  name: string;
  description: string;
  icon: string;
  fromAppId: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  createdBy: number;
  teamId: number;
  copilotPrompt: string;
  group: string;
}
// templates
export const ApiTemplateList = () => {
  return get<Template[]>('/api/template/-/list');
}

// templates
export const ApiTemplateChoose = (templateId: number) => {
  return post<AppResp>(`/api/template/${templateId}/choose`);
}


export const ApiAuthLogin = (data: { email: string; password: string; username: string,login_type: string }) => {
    return post<LoginResponse>('/api/user/login', data);
}

export const ApiAuthRegister = (userData: { email: string; password: string; name: string }) => {
    return post<void>('/api/user/register', userData);
}

export const ApiUserProfile = () => {
    return get<UserProfile>('/api/user/profile');
}




