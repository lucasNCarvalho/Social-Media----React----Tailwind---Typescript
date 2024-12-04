import { IPost } from '@/types';
import { useUserContext } from '@/context/AuthContext';
import like from "../../../public/assets/icons/like.svg";
import liked from "../../../public/assets/icons/liked.svg";
import save from "../../../public/assets/icons/save.svg";
import saved from "../../../public/assets/icons/saved.svg"
import { useUpdatePost } from '@/lib/react-query/queryesAndMutations';

type PostStatsProps = {
    post: IPost;
}

const PostStats = ({ post }: PostStatsProps) => {
    const { user } = useUserContext()
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

    let currentUserLiked = false
    let currentUserSaved = false

    if (post) {
        currentUserLiked = post.likedPosts.some((item) => item.id === user.id)
        currentUserSaved = post.saves
    }

    async function handleLikeUpdate() {
        const formData = new FormData()

        formData.append("like", String(!currentUserLiked));

        await updatePost({ id: post.id, post: formData })
    }

    async function handleSaveUpdate() {
        const formData = new FormData()

        !currentUserSaved

        formData.append("save", String(!currentUserSaved))

        await updatePost({ id: post.id, post: formData })
    }

    return (
        <div className='flex justify-between items-center z-20'>

            < div className='flex gap-2 mr-5'>
                <button onClick={() => handleLikeUpdate()}>
                    <img
                        src={currentUserLiked ? liked : like}
                        alt="like"
                        width={20}
                        height={20}
                        className='cursor-pointer'
                    />
                </button>
                <p className='small-medium lg:base-medium cursor-pointer'>{post?.likedPosts?.length}</p>
            </div>
            < div className='flex gap-2'>
                <button onClick={() => handleSaveUpdate()}>
                    <img
                        src={post.saves ? saved : save}
                        alt="like"
                        width={20}
                        height={20}
                        className='cursor-pointer' />
                </button>
            </div>
        </div>
    )
}

export default PostStats
