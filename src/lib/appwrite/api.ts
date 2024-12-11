import { Ifollow, INewUser, IUnfollow} from "@/types";
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



//fixed
export async function getUserById(id: string) {

  try {
    const response = await api.get(`/profile/${id}`)

    return response.data || []
  } catch (error) {
    throw new Error("Usuário não encontrado")
  }
}


export async function updateUser(userId: string, data: FormData) {

  try {
    const response = await api.patch(`/profile/${userId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;

      if (status === 401) {
        throw { success: false, message: 'Não autorizado' };
      }

      if (status === 404) {
        throw { success: false, message: 'Usuário não encontrado' };
      }

      if (status === 400) {
        throw { success: false, message: 'Tipo de arquivo inválido' };
      }
    }
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


//fixed
export async function getRecentPosts() {
  try {
    const response = await api.get('/post')

    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar postagens')
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


//fixed and new
export async function searchUser(debouncedSearch: string) {

  try {
    const response = await api.get(`/profile`, {
      params: {
        name: `${encodeURIComponent(debouncedSearch)}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

export async function searchPost(debouncedSearch: string) {

  try {
    const response = await api.get(`/post`, {
      params: {
        tag: `${encodeURIComponent(debouncedSearch)}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

export async function getListLikesPost(postId: string) {

  try {
    const response = await api.get(`/post/likes/${postId}`)
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

export async function getFollowingListByUserId(userId: string) {

  try {
    const response = await api.get(`/users/${userId}/following`)
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

export async function getFollowersListByUserId(userId: string) {

  try {
    const response = await api.get(`/users/${userId}/followers`)
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}

export async function getMostLikedPostsThisWeek() {

  try {
    const response = await api.get(`/posts/topPost/week`)
    return response.data
  } catch (error) {
    throw new Error('Falha ao buscar dados, aguarde e tente novamente mais tarde')
  }
}