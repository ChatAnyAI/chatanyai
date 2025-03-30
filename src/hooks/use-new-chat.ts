import { useSidebarDialog } from "@/components/sidebar/sidebar-dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { getFirstPathSegment } from "@/lib/utils";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export const useNewChat = () => {
  const { appId } = useParams<{ appId: string }>();
  const location = useLocation();
  const router = useNavigate();
  const { setOpenMobile } = useSidebar();
  const { handleClose } = useSidebarDialog();
  return () => {
    const path = `${getFirstPathSegment(location.pathname)}/${appId}`;
    router(path);
    setOpenMobile(false);
    handleClose();
  }
}