

import { UserProfileSnippet } from '@/types';
import { DialogContent } from '../ui/dialog';
import { UserBadge } from './UserBadge';
import {useGetFollowingListByUserId} from '@/lib/react-query/queryesAndMutations';

interface ListLikesProps {
    userId: string
}

const ListFollowing = ({ userId }: ListLikesProps) => {
    const { data: followersList } = useGetFollowingListByUserId(userId)


    return (
        < DialogContent className=" bg-dark-3" >
            {followersList && followersList.map((item: UserProfileSnippet) => (
                <UserBadge key={item.id} id={item.id} name={item.name} imageUrl={item.imageUrl} />
            ))}
        </DialogContent >
    )
}

export default ListFollowing
