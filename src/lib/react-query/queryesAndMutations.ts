import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { checkIsUserLoggedFollowingUserId, createPost, createUserAccount, deletePost, followUser, getFollowersListByUserId, getFollowingListByUserId, getListLikesPost, getMostLikedPostsThisWeek, getPostById, getPostByUserId, getPostSavedByUserId, getRecentPosts, getUserById, searchPost, searchUser, signInAccount, signOutAccount, unfollowUser, updatePost, updateUser } from '../appwrite/api'
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID]
      })

    }
    
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
    onSuccess: (_, variables) => {
      const { id } = variables; 
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_USER_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIST_LIKES_BY_POST, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MOST_LIKED_POSTS_THIS_WEEK],
      });
    },
  });
};

export const useGetListLikesPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIST_LIKES_BY_POST, postId],
    queryFn: () => getListLikesPost(postId),
  })
}


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
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEARCH_USER],
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
      }),
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEARCH_USER],
      })
    }
  });
};

export const useSearchUser = (debouncedSearch: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USER, debouncedSearch],
    queryFn: () => searchUser(debouncedSearch),
    enabled: debouncedSearch.length > 1
  })
}

export const useSearcPost = (debouncedSearch: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, debouncedSearch],
    queryFn: () => searchPost(debouncedSearch),
    enabled: debouncedSearch.length > 1
  })
}

export const useGetFollowersListByUserId = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS_LIST_BY_USER_ID, userId],
    queryFn: () => getFollowersListByUserId(userId),
    enabled: !!userId
  })
}

export const useGetFollowingListByUserId = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWING_LIST_BY_USER_ID, userId],
    queryFn: () => getFollowingListByUserId(userId),
    enabled: !!userId
  })
}

export const useGetMostLikedPostsThisWeek = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MOST_LIKED_POSTS_THIS_WEEK],
    queryFn: () => getMostLikedPostsThisWeek(),
  })
}
