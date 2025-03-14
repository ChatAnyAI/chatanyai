import { create } from 'zustand';
import { UserProfile } from '@/service/api';
type NonFunctionProperties<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};



export type GlobalStoreState = {
    theme: string;
    user: UserProfile;
    setTheme: (theme: string) => void;
    setUser: (user: UserProfile) => void;
    clearUser: () => void;
};


const initilState: NonFunctionProperties<GlobalStoreState> = {
    theme: 'light',
    user: {
        id: 0,
        name: '',
        avatar: '',
        email: '',
    } as UserProfile,
};
export const useGlobalStore = create<GlobalStoreState>((set) => ({
    ...initilState,
    user: initilState.user,
    setTheme: (theme: string) => set({ theme }),
    setUser: (user: UserProfile) => {
        const currentTeam = user.teams.find(team => team.teamId === user.currentTeamId);
        // Find the corresponding currentTeamId and set it to currentTeam
        if (currentTeam) {
            user.currentTeam = currentTeam;
        }
        set({ user });
    },
    clearUser: () => {
        set({
            user: initilState.user
        })
    }
}));




