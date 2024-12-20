
import AlertDialogButton from '@/components/shared/AlertDialogButton';
import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/PostStats';
import { toast } from '@/components/ui/use-toast';

import { useUserContext } from '@/context/AuthContext';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queryesAndMutations'
import { multiFormatDateString } from '@/lib/utils';
import { Link, useNavigate, useParams } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams()

  const { data: post, isPending } = useGetPostById(id || '');
  const { mutateAsync: deletePost, isPending: deleteLoading } = useDeletePost()
  const { user } = useUserContext();
  const navigate = useNavigate()

  async function handleDeletePost() {
    try {
      if (!id) return;
      await deletePost({ postId: id });

      toast({ title: "Publicação excluída com sucesso" });
      navigate('/')
    } catch (error) {
      toast({ title: "Houve uma falha ao excluir publicação, tente novamente mais tarde" });
    }


  }
  return (
    <div className='post_details-container'>
      {isPending ? <Loader /> : (
        <div className='post_details-card'>
          <img
            src={post?.image[0].url}
            alt='post'
            className='post_details-img'
          />
          <div className="post_details-info">
            <div className='flex-between w-full'>
              <Link to={`/profile/${post?.creator.id}`} className='flex items-center gap-3'>
                <img
                  src={post?.creator.imageUrl || 'assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.created_at)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className='flex-center'>
                <Link to={`/update-post/${post?.id}`} className={`${user.id !== post?.creator.id && 'hidden'}`}>
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>
                <div className={`${user.id !== post?.creator.id && 'hidden'}`}>
                  <AlertDialogButton handleDeletePost={handleDeletePost} />
                </div>
              </div>
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className="small-medium lg:base-medium py-5">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className='w-full'>
              {post && (
                <PostStats post={post} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails