import { INewPost, INewUser, IUpdatePost } from "@/types";
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

//todo
export async function getUserById(id: string) {
  try {
    const user = await databases.listDocuments(

      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', id)]
    )

    if (!user) throw Error;

    return user.documents[0];

  } catch (error) {
    console.log(error)
    return null;
  }
}

//fixed
export async function signOutAccount() {

  try {
    await api.delete('/logout')

  } catch (error) {
    throw new Error('Houve uma falha ao te desconectar')
  }
}

export async function createPost(post: INewPost) {

  try {

    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageid: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
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

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )

  if (!posts) throw Error;

  return posts;
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


export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return post
  } catch (error) {
    console.log(error)
  }
}


export async function updatePost(post: IUpdatePost) {

  const hasFileToUpdate = post.file.length > 0;

  try {

    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }


    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageid: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatePost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}


export async function deletePost(postId: string, imageId: string) {

  if (!postId || !imageId) throw Error;

  try {

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
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



export async function followUser(user: any, userFollow: string) {


  if (user?.following.includes(userFollow)) {
    return
  }

  user?.following.push(userFollow)

  try {
    const userUpdated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        following: user.following
      })

    return userUpdated
  } catch (error) {
    console.log(error)
  }
}


export async function deletefollowUser(user: any, userFollow: string) {

  const followDeleted = user?.following.filter((item: string) => item !== userFollow)

  try {
    const userUpdated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        following: followDeleted
      })

    return userUpdated
  } catch (error) {
    console.log(error)
  }
}