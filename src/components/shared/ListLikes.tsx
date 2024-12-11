

import { UserProfileSnippet } from '@/types';
import { DialogContent } from '../ui/dialog';
import { UserBadge } from './UserBadge';
import { useGetListLikesPost } from '@/lib/react-query/queryesAndMutations';

interface ListLikesProps {
    postId: string
}

const ListLikes = ({ postId }: ListLikesProps) => {
    const { data: listLikes } = useGetListLikesPost(postId)


    return (
        < DialogContent className=" bg-dark-3" >
            {listLikes && listLikes.map((item: UserProfileSnippet) => (
                <UserBadge key={item.id} id={item.id} name={item.name} imageUrl={item.imageUrl} />
            ))}
        </DialogContent >
    )
}

export default ListLikes
