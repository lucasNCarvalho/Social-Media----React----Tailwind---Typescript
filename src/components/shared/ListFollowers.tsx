

import { UserProfileSnippet } from '@/types';
import { DialogContent } from '../ui/dialog';
import { UserBadge } from './UserBadge';
import { useGetFollowersListByUserId} from '@/lib/react-query/queryesAndMutations';

interface ListLikesProps {
    userId: string
}

const ListFollowers = ({ userId }: ListLikesProps) => {
    const { data: followersList } = useGetFollowersListByUserId(userId)


    return (
        < DialogContent className=" bg-dark-3" >
            {followersList && followersList.map((item: UserProfileSnippet) => (
                <UserBadge key={item.id} id={item.id} name={item.name} imageUrl={item.imageUrl} />
            ))}
        </DialogContent >
    )
}

export default ListFollowers
