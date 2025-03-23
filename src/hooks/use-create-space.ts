import { ApiAppCreate, ApiDatasetCreate, ApiCopilotCreate, ApiTemplateChoose } from '@/service/api'
import { AppType, RouteEnum } from '@/lib/constants/constants';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chatStore';

export const useCreateSpace = () => {
  const { toast } = useToast();
  const fetchAppList = useChatStore(state => state.fetchAppList);
  const navigator = useNavigate();

  const createSpace = async (type: AppType) => {
    try {
      let res;
      switch (type) {
        case AppType.ChatPDF:
        case AppType.MeetingChat:
          res = await ApiAppCreate({
            type,
            name: 'untitled',
            icon: '',
            description: '',
          });
          break;
        case AppType.Copilot:
          res = await ApiCopilotCreate({
            name: 'untitled',
            icon: '',
            description: '',
            copilotPrompt: ''
          });
          break;
        case AppType.KnowledgeBase:
         res = await ApiDatasetCreate({
            title: 'untitled',
            icon: '',
            description: '',
          });
      }
      fetchAppList();
      toast({
        title: 'Space created successfully',
      });
      navigator(`/${RouteEnum[type]}/${res.id}`);
    } catch (error) {
        toast({
            title: "Create fail",
            description:  String(error),
            variant: "destructive",
        })
    }
  }

  const chooseCopilotTemplate = async (templateId: number) => { 
   const res = await ApiTemplateChoose(templateId);
    fetchAppList();
    toast({
      title: 'Space created successfully',
    });
    navigator(`/${RouteEnum[AppType.Copilot]}/${res.id}`);

  }

  return {createSpace, chooseCopilotTemplate};
};