import { ApiSpaceDrag, ApiUpdateAppInfo, UpdateAppInfoRequest, ApiDatasetDelete } from '@/service/api'
import { useChatStore } from '@/store/chatStore'
export const useSpaceDrag = () => {

  const fetchAppList = useChatStore((state) => state.fetchAppList)
  const onDragEnd = async (curSpaceId: string, targetSpaceId: string, positon: 'before' | 'after') => {
    await ApiSpaceDrag({
      dropPosition: positon,
      spaceGuid: curSpaceId,
      targetSpaceGuid: targetSpaceId,
    })
    fetchAppList();
  }

  return {
    onDragEnd
  }
}


export function useSpaceApi() {
  const fetchAppList = useChatStore((state) => state.fetchAppList)
  const onUpdate = async (appId: string,data: UpdateAppInfoRequest) => {
    await ApiUpdateAppInfo(appId,data);
    fetchAppList();
  }

  const onDelete = async (appId: string) => {
    await ApiDatasetDelete(appId);
    fetchAppList();
  }


  return {
    onUpdate,
    onDelete
  }
}