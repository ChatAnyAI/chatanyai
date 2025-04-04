import * as React from "react";
import {useGlobalStore} from "@/store/globalStore";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {AvatarUser, UserProfile} from "@/service/api";

export function MyUserAvatar() {
    const user = useGlobalStore(state => state.user);
    return (
        <UserAvatar
            user={user}
        />
    )
}

export function UserAvatar({ className, user }: {user: AvatarUser, className?: string}) {
    className = className || "h-8 w-8 rounded-lg";

    return (
        <Avatar className={className}>
            {user && (user.avatar.includes("default://") ? <DefaultAvatar user={user} /> : <AvatarImage src={user.avatar} alt={user.name} />)}
            {/*{user &&<AvatarFallback className="rounded-full bg-linear-to-br from-green-400 to-blue-500 text-white">{user?.name.charAt(0)}</AvatarFallback>}*/}
        </Avatar>
    )
}

export function DefaultAvatar({ user }: {user: AvatarUser}) {
    let className = "";
    switch (user.avatar) {
        case "default://1.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-red-400 to-blue-500 text-white";
            break
        case "default://2.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-yellow-400 to-red-500 text-white";
            break
        case "default://3.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-green-400 to-blue-500 text-white";
            break
        case "default://4.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-orange-400 to-blue-500 text-white";
            break
        case "default://5.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-pink-400 to-blue-500 text-white";
            break
        case "default://6.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-rose-400 to-blue-500 text-white";
            break
        case "default://7.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-sky-400 to-blue-500 text-white";
            break
        case "default://8.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-fuchsia-400 to-blue-500 text-white";
            break
        case "default://9.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-cyan-400 to-blue-500 text-white";
            break
        case "default://10.jpg":
            className = "h-full w-full rounded-full bg-linear-to-br from-amber-400 to-pink-500 text-white";
            break

    }

    return (
        <Avatar className="h-full w-full  rounded-lg">
            <AvatarFallback className={className}>{user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}