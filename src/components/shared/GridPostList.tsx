import { useUserContext } from '@/context/AuthContext'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { IPost } from '@/types'
import profile from './../../../public//assets/images/profile.webp'

type GridPostListProps = {
    posts: IPost[]
    showUser?: boolean;
    showStats?: boolean;

}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {

    const { user } = useUserContext();

    return (
        <ul className='grid-container '>
            {posts && posts.map((post) => (
                <li key={post.id} className='relative min-w-80 h-80'>
                    <Link to={`/posts/${post.id}`} className='grid-post_link'>
                        <img src={post.image[0].url} alt="imagePost" className='h-full w-full object-cover' />
                    </Link>

                    <div className='grid-post_user '>
                        {showUser && (
                            <div className='flex items-center justify-start gap-2 flex-1'>
                                <img src={post.creator.imageUrl ?? profile} alt="creatorImage" className='h-8 w-fit rounded-full' />
                                <p className='line-champ-1'>{post.creator.name}</p>
                            </div>
                        )}
                        {showStats &&  <div className='flex-1'>
                            <PostStats post={post} />
                        </div>}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GridPostList
