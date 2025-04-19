import { ApiAppCreate, ApiKnowledgeCreate, ApiCopilotCreate, ApiTemplateChoose } from '@/service/api'
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
         res = await ApiKnowledgeCreate({
            title: 'untitled',
            icon: '',
            description: '',
          });
        case AppType.Note:
          res = await ApiAppCreate({
              type,
              name: 'untitled',
              icon: '',
              description: '',
          });
      }
      fetchAppList();
      toast({
        title: 'Space created successfully',
      });
      navigator(`/${RouteEnum[type]}/${res.guid}`);
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
    navigator(`/assistant`);
  }

  return {createSpace, chooseCopilotTemplate};
};