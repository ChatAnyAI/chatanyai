import { useParams } from "react-router-dom";

export const useDocumentId = () => { 
  const { channelId } = useParams();
  return channelId;
}