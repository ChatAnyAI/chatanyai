import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {ApiUpdateChatInfo, ApiUpdateChatVisibility, ApiUpdateAppVisibility} from '@/service/api';
import { AppVisibility } from '@/lib/constants/constants';

export const useVisibility = (initialVisibility: AppVisibility = 1, appId: string, channelId: string) => {
  const [visibility, setVisibility] = useState<AppVisibility>(initialVisibility);
  const { toast } = useToast();

  const handleVisibilityChange = async (newVisibility: AppVisibility) => {
    if (channelId) {
      try {
        await ApiUpdateChatVisibility(channelId, newVisibility);
        toast({
          title: "change visibility success",
        });
        setVisibility(newVisibility);
      } catch (error) {
        toast({
          title: "Failed to change visibility",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      await ApiUpdateAppVisibility(appId, newVisibility);
      toast({
        title: "change visibility success",
      });
      setVisibility(newVisibility);
    } catch (error) {
      toast({
        title: "Failed to change visibility",
        variant: "destructive"
      });
    }
  };

  return {
    visibility,
    setVisibility,
    handleVisibilityChange
  };
};