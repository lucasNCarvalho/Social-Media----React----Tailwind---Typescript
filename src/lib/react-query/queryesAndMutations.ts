import {  useMutation, useQueryClient, useInfiniteQuery, useQuery} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, deletefollowUser, followUser, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getSavedPosts, getUseById, getUserById, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './querykeys'
import axios from 'axios';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {email: string; password: string}) => signInAccount(user)
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
    mutationFn: async (formData: any) => {
      try {
          const response = await axios.post('http://localhost:3333/post', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
          return response.data; // Você pode retornar os dados da resposta se necessário
      } catch (error) {
          throw new Error('Erro ao criar postagem');
      }
  },
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
    const queryClient = useQueryClient ();
    
    return useMutation({
      mutationFn: ({postId, likesArray}: {postId: string; likesArray: string[]}) => likePost(postId, likesArray),onSuccess: (data) => {
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
    const queryClient = useQueryClient ();
    
    return useMutation({
      mutationFn: ({postId, userId}: { userId: string; postId: string}) => savePost(postId, userId),onSuccess: () => {
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
    const queryClient = useQueryClient ();
    
    return useMutation({
      mutationFn: (savedRecordedId: string) => deleteSavedPost(savedRecordedId),onSuccess: () => {
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
      queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      queryFn: () => getUserById(id)
    })
  }

  export const useGetPostById = (postId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId
    })
  }

  export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: IUpdatePost) => updatePost(post),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
      },
    });
  };
  

  export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        });
      },
    });
  };

  export const useGetPosts = () => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts as any,
      getNextPageParam: (lastPage: any) => {
        if(lastPage && lastPage.documents.length === 0) return null;
        
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

  export const useFollowUser = () => {
    return useMutation({
      mutationFn: ({ user, userFollow }: {user: Object, userFollow: string}) => followUser(user, userFollow),
    });
  };
    


  export const useDeleteFollowUser = () => {
    return useMutation({
      mutationFn: ({user, userFollow}: {user: any, userFollow: string}) => deletefollowUser(user, userFollow),
    });
  };
