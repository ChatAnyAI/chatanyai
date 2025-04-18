import { useGlobalStore } from "@/store/globalStore";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useIsIframe = () => {
  const [searchParams] = useSearchParams();

  return searchParams.get('iframe') === 'true';
};


export const useAuthGuard = () => {
  const user = useGlobalStore((state) => state.user);

  const isIframe = useIsIframe();

  return useCallback(
    (callback?: () => Promise<void> | void) => {
      if (!user?.id) {
        if (isIframe) {
          // window.open('https://potion.platejs.org/login', '_blank');

          return true;
        } else {
          // pushModal('Login');
        }

        return true;
      }

      return callback ? void callback() : false;
    },
    [isIframe, user?.id]
  );
};