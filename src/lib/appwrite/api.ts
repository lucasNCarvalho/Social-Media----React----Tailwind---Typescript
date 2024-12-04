import { Ifollow, INewUser, IUnfollow} from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, databases, storage } from "./config";
import { api } from "../axios";
import axios from "axios";

//fixed
export async function createUserAccount(user: INewUser) {
  try {
    const { email, name, password, userName } = user;

    const newUser = await api.post('/users', {
      name, userName, email, password
    });

    return newUser;
  } catch (error) {

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        const conflictField = error.response.data.field;

        if (conflictField === 'email') {
          throw new Error('Este e-mail já está em uso.');
        } else if (conflictField === 'username') {
          throw new Error('Este nome de usuário já está em uso.');
        }
      }
    }


    throw new Error('Falha ao criar nova conta');
  }
}

//todo
export async function saveUserToDB(user: {
  accountid: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {

  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )

    return newUser;
  }
  catch (error) {
    console.log(error)
  }
}

//fixed
export async function signInAccount(user: { email: string; password: string; }) {
  const { email, password } = user

  try {
    const session = await api.post('/sessions', {
      email, password
    })

    return session
  } catch (error) {
    throw new Error('Dados invalidos')
  }

}

//todo
export async function getCurrentUser() {
  try {

    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(

      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountid', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];

  } catch (error) {
    console.log(error)
    return null;
  }
}

//fixed
export async function getUserById(id: string) {
  console.log('userBYiD', id)
  try {
    const response = await api.get(`/profile/${id}`)

    return response.data || []
  } catch (error) {
    throw new Error("Usuário não encontrado")
  }
}

//fixed
export async function signOutAccount() {

  try {
    await api.delete('/logout')
    localStorage.removeItem('token');
    window.location.replace('/sign-in');
  } catch (error) {
    throw new Error('Houve uma falha ao te desconectar')
  }
}


//fixed
export async function createPost(post: FormData) {
  try {

    const response = await api.post("/post", post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 404) {
        throw { success: false, message: 'Post não encontrado' };
      }
    }
    throw { success: false, message: 'Erro desconhecido, por favor tente mais tarde' };
  }

}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {

  console.log("file", file)

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

//fixed
export async function getRecentPosts() {
  try {
    const response = await api.get('/post')

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar postagens')
  }
}

export async function likePost(postId: string, likesArray: string[]) {


  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {

    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error;

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

//fixed
export async function getPostById(postId: string) {
  try {
    const response = await api.get(`/post/${postId}`)

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar postagem pelo Id')
  }
}

//fixed and new
export async function getPostByUserId(userId: string) {
 
  try {
    const response = await api.get('/post', {
      params: {
        userId,
        onlyOwnPosts: true
      }
    })

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar postagem pelo Id')
  }
}

export async function getPostSavedByUserId() {
 
  try {
    const response = await api.get('/post', {
      params: {
        savedPosts: true
      }
    })

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar postagem salvas')
  }
}

//fixed
export async function updatePost(id: string, data: FormData) {
  try {
    const response = await api.patch(`/post/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {

    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 400) {
        throw { success: false, message: 'Parâmetros inválidos' };
      }

      if (status === 404) {
        throw { success: false, message: 'Post não encontrado' };
      }

      if (status === 409) {
        throw { success: false, message: 'Você não tem permissão para executar essa operação' };
      }


    }

    throw new Error('Falha ao atualizar post');
  }

}


export async function deletePost(postId: string) {

  try {
    const response = await api.delete(`/post/${postId}`)

    return response
  } catch (error) {
   
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 400) {
        throw { success: false, message: 'Parâmetros inválidos' };
      }

      if (status === 404) {
        throw { success: false, message: 'Post não encontrado' };
      }

      if (status === 409) {
        throw { success: false, message: 'Você não tem permissão para executar essa operação' };
      }

    }
    
    throw new Error('Falha ao atualizar post');
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }

}

export async function searchPosts(searchTerm: string) {

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }

}

//fixed and new
export async function checkIsUserLoggedFollowingUserId(userId: string) {
 
  try {
    const response = await api.get(`/follow/${userId}`)

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

//fixed and new
export async function followUser(userToFollow: Ifollow) {
  try {

    const response = await api.post("/follow", userToFollow);

    return response

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 404) {
        throw { success: false, message: 'Você não está seguindo este usuário' };
      }

      if (status === 409) {
        throw { success: false, message: 'Você já está seguindo esse usuário' };
      }
    }
    throw { success: false, message: 'Erro desconhecido, por favor tente mais tarde' };
  }

}

//fixed and new
export async function unfollowUser(userToUnfollow: IUnfollow) {
  try {

    const response = await api.post("/follow", userToUnfollow);

    return response

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 404) {
        throw { success: false, message: 'Você não está seguindo este usuário' };
      }

      if (status === 409) {
        throw { success: false, message: 'Você já está seguindo esse usuário' };
      }
    }
    throw { success: false, message: 'Erro desconhecido, por favor tente mais tarde' };
  }

}


