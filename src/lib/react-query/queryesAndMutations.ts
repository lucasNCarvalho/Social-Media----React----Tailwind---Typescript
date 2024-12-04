import { useMutation, useQueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { checkIsUserLoggedFollowingUserId, createPost, createUserAccount, deletePost, deleteSavedPost, followUser, getCurrentUser, getInfinitePosts, getPostById, getPostByUserId, getPostSavedByUserId, getRecentPosts, getUserById, likePost, savePost, searchPosts, signInAccount, signOutAccount, unfollowUser, updatePost } from '../appwrite/api'
import { Ifollow, INewUser, IPost, IUnfollow } from '@/types'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInAccount(user)
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}


export const useLikedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray), onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}


export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { userId: string; postId: string }) => savePost(postId, userId), onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordedId: string) => deleteSavedPost(savedRecordedId), onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS]
      })
    }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}

export const useGetUserById = (id: string) => {

  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
    queryFn: () => getUserById(id)
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery<IPost | null>({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}


export const useGetPostSavedByUserId = () => {

  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS_SAVED_BY_USER_ID],
    queryFn: () => getPostSavedByUserId()
  })
}

export const useGetPostByUserId = (userId: string) => {
  console.log('query', userId)
  return useQuery<IPost[] | null>({
    queryKey: [QUERY_KEYS.GET_POST_BY_USER_ID, userId],
    queryFn: () => getPostByUserId(userId),
    enabled: !!userId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, post }: { id: string, post: FormData }) => updatePost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_USER_ID],
      })
    },
  });
};


export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_USER_ID]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS_SAVED_BY_USER_ID]
      })
    },
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      if (lastPage && lastPage.documents.length === 0) return null;

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

      return lastId;
    },
    initialPageParam: 0
  })
}

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
  })
}



export const useCheckIsUserLoggedFollowingUserId = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_IS_FOLLOWING_USER_ID, userId],
    queryFn: () => checkIsUserLoggedFollowingUserId(userId),
    enabled: !!userId
  })
}


export const usefollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userToFollow: Ifollow) => followUser(userToFollow),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_IS_FOLLOWING_USER_ID],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      })
    }
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userToUnfollow: IUnfollow) => unfollowUser(userToUnfollow),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_IS_FOLLOWING_USER_ID],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      })
    }
  });
};
