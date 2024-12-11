import { Button } from "../ui/button";
import profile from '../../../public/assets/images/profile.webp'
import { Link } from "react-router-dom";
import { usefollowUser, useUnfollowUser } from "@/lib/react-query/queryesAndMutations";


interface UseCardProps {
    id: string
    name: string;
    imageUrl: string;
    userName: string;
    isFollowing: boolean;
}

export function UserCard({id, imageUrl, name, userName, isFollowing }: UseCardProps) {
    const { mutateAsync: followUser } = usefollowUser()
    const { mutateAsync: unfollowUser } = useUnfollowUser()

    async function handleFollowUser(event: React.MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (!id) return
        await followUser({ userId: id, action: 'follow' })
      }
    
      async function handleUnfollowUser(event: React.MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (!id) return
        await unfollowUser({ userId: id, action: 'unfollow' })
      }

    return (
        <Link className="w-[15.75rem] flex flex-col gap-3 items-center justify-center border-2 border-dark-4 py-8 px-10 rounded-3xl" to={`/profile/${id}`}>
            <img src={imageUrl || profile} alt="" className="w-20 rounded-full" />
            <h1 className="font-bold">{name}</h1>
            <p className="text-primary-500">@{userName}</p>
            {isFollowing ?
                  <Button type="button" className={` bg-dark-2 border-2 `} onClick={handleUnfollowUser}>
                    <p>Seguindo</p>
                  </Button>
                  :
                  <Button type="button" className={` shad-button_primary hidden `}  onClick={handleFollowUser} >
                    <p>Seguir</p>
                  </Button>
                }
        </Link>
    )
}