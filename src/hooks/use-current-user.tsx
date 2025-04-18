import { useGlobalStore } from "@/store/globalStore"

export const useCurrentUser = () => { 
  const user = useGlobalStore((state) => state.user);
  return user;
}