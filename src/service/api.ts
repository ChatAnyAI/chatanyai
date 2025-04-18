import { get, post, del, put } from "@/lib/request";
import {
  AppSubType,
  AppType,
  AppVisibility,
  EmployeeStatus,
  PermissionType,
  ProductType,
  UserRole
} from "@/lib/constants/constants";
import { Pagination } from "@/components/ui/pagination";

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

export const ApiUserSetting = (avatar: string) => {
  put<void>(`/api/userSetting/general`, {
    avatar
  });
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

export interface Employee {
    id: number;
    avatar: string;
    name: string;
}


export interface Assistant {
  id: number;
  avatar: string;
  name: string;
}


export interface ChatAssistantResp {
  content: string;
  assistant: Assistant;
}

export interface ShareUser {
  id: number;
  name: string;
  avatar: string;
  email: string;
  permission: PermissionType;
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
  isFullAccess: boolean;
}
export type SpaceResp = Space & {
  isFullAccess: boolean;
  app: AppResp;
}
export const ApiSpaceList = () => {
  return get<Array<SpaceResp>>('/api/space/list');
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
  guid: string;
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
  visibility: AppVisibility; // Assuming Visibility is already defined in your constants
  permission: PermissionType;
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

export const ApiUpdateAppVisibility = (appId: string, visibility: AppVisibility) => {
  return put<void>(`/api/app/${appId}/visibility`, { visibility });
}

export interface UpdateAppInfoRequest {
  name: string;
  description?: string;
  icon?: string;
  copilotPrompt?: string;
  fileIds?: string[];
}
export const ApiUpdateAppInfo = (appId: string, data: UpdateAppInfoRequest) => {
  return put<void>(`/api/app/${appId}/info`, data);
}

export const ApiShareWithMeList = () => {
  return get<Array<{ app?: AppResp, chat?: RespChannel, fromUser: User }>>('/api/share/-/list');
}

export interface ApiAppShareCreateRequest {
  uids: number[];
  permission: PermissionType;
}

export const ApiAppShareCreate = (appId: string, req: ApiAppShareCreateRequest) => {
  return put<void>(`/api/app/${appId}/share`, req);
}

export const ApiAppShareDelete = (appId: string, uid: number) => {
  return del<void>(`/api/app/${appId}/share/${uid}`);
}

export const ApiAppShareUpdatePermission = (appId: string, uid: number, permission: PermissionType) => {
  return put<void>(`/api/app/${appId}/share/${uid}/permission`, {
    permission
  });
}

export const ApiAppUpdatePermission = (appId: string, permission: PermissionType) => {
  return put<void>(`/api/app/${appId}/permission`, {
    permission
  });
}

export const ApiAppShareUserList = (appId: string) => {
  return get<ShareUser[]>(`/api/app/${appId}/share/-/userList`);
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

export type ApiEmployeeItemResp = {
  id: number
  name: string
  role: string
  status: EmployeeStatus
  createdAt: number
  avatar: string
  prompt: string
}


export const ApiEmployeeList = () => {
  return get<ApiEmployeeItemResp[]>('/api/my/employee/-/list');
}


export interface ApiEmployeeCreateRequest {
  name: string
  role: string
  status: EmployeeStatus
  avatar: string
  prompt: string
}

export const ApiEmployeeCreate = (req: ApiEmployeeCreateRequest) => {
  return post<void>(`/api/my/employee`, req);
}




export interface ApiEmployeeUpdateRequest {
  name: string
  role: string
  status: EmployeeStatus
  avatar: string
  prompt: string
}

export const ApiEmployeeUpdate = (employeeId: number, req: ApiEmployeeUpdateRequest) => {
  return put<void>(`/api/my/employee/${employeeId}`, req);
}


export const ApiEmployeeDelete = (employeeId: number) => {
  return del<void>(`/api/my/employee/${employeeId}`);
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
  name: string;
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

// export const ApiPostChat = (data: PostChatRequest) => {
//   return post<void>(`/api/app/${data.appId}/chat/${data.id}`, data);
// }

export interface RespChannelUser {
  id: number;
  name: string;
  avatar: string;
}

export interface MyPermission {
  permissionType: PermissionType;
}

export interface RespChannel {
  guid: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  uid: number;
  visibility: AppVisibility;
  permission: PermissionType;
  user: RespChannelUser;
  myPermission: MyPermission;
  pdfLink: string;
}
export const ApiGetChat = (channelId: string) => {
  return get<RespChannel>(`/api/channel/${channelId}`);
}

export interface RespChatHistoryMessage {
  id: string;
  channelId: string;
  role: string;
  content: string;
  ragContent: string;
  attachments: PostChatMessageAttachment[]; // Reuse existing PostChatMessageAttachment interface
  createdAt: number;
  user: User;
  assistant: Assistant;
}

export const ApiChatHistory = (channelId: string, data?: Pagination) => {
  return get<RespChatHistoryMessage[]>(`/api/channel/${channelId}/history`, {
    params: {
      pagination: JSON.stringify(data)
    }
  });
}

export interface UpdateChatInfoRequest {
  title?: string;
}

export const ApiUpdateChatInfo = (channelId: string, data: UpdateChatInfoRequest) => {
  return put<void>(`/api/channel/${channelId}/info`, data);
}

export const ApiChatCreate = (appId: string, data: { fileId?: number }) => {
  return post<{ guid: string }>(`/api/app/${appId}/channel`, data);
}

export const ApiUpdateChatVisibility = (channelId: string, visibility: AppVisibility) => {
  return put<void>(`/api/channel/${channelId}/visibility`, { visibility });
}

export const ApiChannelListByAppId = (appId: string) => {
  return get<RespChannel[]>(`/api/app/${appId}/channel/-/list`);
}

export const ApiChatShareList = (channelId: string) => {
  return get<ShareUser[]>(`/api/channel/${channelId}/share/-/userList`);
}

export interface ApiChatShareCreateRequest {
  uids: number[];
  permission: PermissionType;
}

export const ApiChatShareCreate = (channelId: string, req: ApiChatShareCreateRequest) => {
  return put<void>(`/api/channel/${channelId}/share`, req);
}

export const ApiChatShareDelete = (channelId: string, uid: number) => {
  return del<void>(`/api/channel/${channelId}/share/${uid}`);
}

export const ApiChatShareUpdatePermission = (channelId: string, uid: number, permission: PermissionType) => {
  return put<void>(`/api/channel/${channelId}/share/${uid}/permission`, {
    permission
  });
}

export const ApiChatUpdatePermission = (channelId: string, permission: PermissionType) => {
  return put<void>(`/api/channel/${channelId}/permission`, {
    permission
  });
}


export interface MeetingMember {
  name: string;
  description: string;
}
export interface MeetingRequest {
  maxRounds: number;
  members: MeetingMember[];
  messages: PostChatMessage[];
  id: string;      // channelId
  appId: string;
  topic: string;   // meeting topic
  modelId: string;
  options: Record<string, any>;
  // pdfLink?: string;
}

// export const ApiMeetingCreate = (data: MeetingRequest) => {
//   return post<void>(`/api/app/${data.appId}/chat/${data.id}/meeting`, data);
// }
//
//
// export const ApiStreamChat = () => {
//   return get<void>('/api/stream');
// }
//
// export const ApiStreamChatOllama = () => {
//   return get<void>('/api/streamOllama');
// }
//
// export const ApiMultiStreamChatOllama = () => {
//   return get<void>('/api/multiStreamOllama');
// }

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

export interface Template extends ApiEmployeeItemResp {
  uid: number;
  teamId: number;
  group: string;
}


// templates
export const ApiTemplateList = (group: string, keyword:string, pageToLoad: number) => {
  // TODO: Implement pagination
  return get<ResponseWithPagination<Template[]>>('/api/template/-/list', {
    params: {
      group,
      keyword,
      pagination: JSON.stringify({
        currentPage: pageToLoad,
        pageSize: 10
      })
    }
  });
}

// templateGroups
export const ApiTemplateGroupList = () => {
  // TODO: Implement pagination
  return get<string[]>('/api/template/-/category', {
  });
}

export interface ApiCreateDocResp {
  guid: string;
}

export const ApiCreateDoc = (appId: string) => {
  return post<ApiCreateDocResp>(`/api/app/${appId}/doc`);
}

export const ApiDocContent = (appId: string, channelId: string, req: { content: string }) => {
  return put<void>(`/api/app/${appId}/doc/${channelId}/content`, req);
}

// 定义 ChangeSortReq 接口，对应 Go 结构体
interface ApiDocChangeSortReq {
  // 拖动方向，只能是 'before' 或者 'after'
  dropPosition: 'before' | 'after';
  // 当前被拖动的元素的唯一标识
  guid: string;
  // 目标元素的唯一标识，可能不存在
  targetGuid?: string;
  // 父级元素的唯一标识，可能不存在
  parentGuid?: string;
}
export const ApiDocChangeSort = (appId: string, data: ApiDocChangeSortReq) => { 
  return put<void>(`/api/app/${appId}/doc/-/changeSort`, data);
}

export interface ApiDocAppendContentReq {
  referContent: string;
  referChannelId: string;
  referAnchorId: string;
}

export const ApiDocAppendContent = (appId: string, channelId: string, req: ApiDocAppendContentReq) => {
  return put<void>(`/api/app/${appId}/doc/${channelId}/appendContent`, req);
}


export const ApiDocRecent = () => {
  return get<DocInfo[]>(`/api/doc/-/recent`);
}


export interface DocInfo {
  appId: string;
  channelId: string;
  name: string;
  updatedAt: number;
  icon: string
}

// /api/app/:appId/doc/-/list
export const ApiDocList = (appId: string) => {
  return get<DocInfo[]>(`/api/app/${appId}/doc/-/list`);
}

export interface ApiCreateDocResp {
  content: string;
}

export const ApiGetDoc = (channelId: string) => {
  return get<ApiCreateDocResp>(`/api/doc/${channelId}`);
}


// templates
export const ApiTemplateChoose = (templateId: number) => {
  return post<AppResp>(`/api/template/${templateId}/choose`);
}


export const ApiAuthLogin = (data: { email: string; password: string; username: string, login_type: string }) => {
  return post<LoginResponse>('/api/user/login', data);
}

export const ApiAuthRegister = (userData: { email: string; password: string; name: string }) => {
  return post<void>('/api/user/register', userData);
}

export const ApiUserProfile = () => {
  return get<UserProfile>('/api/user/profile');
}

export const ApiOauthSupport = () => {
  return get<string[]>('/api/oauth/support');
}


export const ApiDocCommentDiscussionList = (documentId: string) => {
  return get(`/api/discussion/list`, {
    params: {
      documentId
    }
  })
}

interface ApiCommentWithDiscussionCreateRequest {
  contentRich: string;
  discussionId: string;
  documentContent: string;
  documentId: string;
}
export const ApiDocCommentWithDiscussionCreate = (data: ApiCommentWithDiscussionCreateRequest) => { 
  return post(`/api/discussion/createWithComment`, data);
}
interface ApiCommentCreateRequest {
  discussionId: string;
  documentContent: string;
}
export const ApiDocCommentCreate = (data: ApiCommentCreateRequest) =>{ 
  return post(`/api/discussion/create`, data);
}
interface ApiCommentUpdateRequest {
  id: string;
  contentRich: string;
  discussionId: string;
  isEdited: boolean;
}
export const ApiDocCommentUpdate = (data: ApiCommentUpdateRequest) => {
  return post(`/api/comment/update`, data);
}

export const ApiDocDiscussionResolve = (data: {id: string}) => {
  return post(`/api/discussion/resolve`, data);
}

export const ApiDocDiscussionDetele = (data: { id: string }) => {
  return del(`/api/discussion/delete`, data);
}

export const ApiDocCommentDetele = (data: { id: string }) => {
  return del(`/api/comment/delete`, data);
}

export const ApiDocVersionList = (documentId: string) => {
  return get(`/api/doc/version/list`, {
    params: {
      documentId
    }
  })
}

export const ApiDocVersionCreate = (documentId: string) => {
  return post(`/api/doc/version/create`, {
    documentId
  })
}
export const ApiDocVersionRestore = (id: string) => {
  return post(`/api/doc/version/restore`, {
    id
  })
}
export const ApiDocVersionDelete = (id: string) => {
  return post(`/api/doc/version/delete`, {
    id
  })
}

export const ApiDocVersionDetail = (documentVersionId: string) => {
  return get(`/api/doc/version/detail`, {
    params: {
      documentVersionId
    }
  })
}