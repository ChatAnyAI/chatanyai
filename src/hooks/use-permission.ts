
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    ApiUpdateChatInfo,
    ApiUpdateChatVisibility,
    ApiUpdateAppVisibility,
    ApiChatShareUpdatePermission, ApiAppShareUpdatePermission, ApiChatUpdatePermission, ApiAppUpdatePermission
} from '@/service/api';
import {AppVisibility, PermissionType} from '@/lib/constants/constants';

export const usePermission = (initialPermission: PermissionType = 1,visibility: AppVisibility, appId: string, channelId: string) => {
  const [permission, setPermission] = useState<PermissionType>(initialPermission);
  const { toast } = useToast();

  const handlePermissionChange = async (newPermission: PermissionType) => {
    if (channelId) {
      try {
        await ApiChatUpdatePermission(channelId, newPermission);
        toast({
          title: "change permission success",
        });
          setPermission(newPermission);
      } catch (error) {
        toast({
          title: "Failed to change permission",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      await ApiAppUpdatePermission(appId, newPermission);
      toast({
        title: "change permission success",
      });
        setPermission(newPermission);
    } catch (error) {
      toast({
        title: "Failed to change permission",
        variant: "destructive"
      });
    }
  };

  return {
      permission,
      setPermission,
      handlePermissionChange
  };
};