// export type IContenxtType = {
//   user: IUser;
//   isLoading: boolean;
//   // setUser: React.Dispatch<React.SetStateAction<IUser>>;
//   isAuthenticated: boolean;
//   // setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   checkAuthUser: () => Promise<boolean>;
// };

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
  imagem: any
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  userName: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  userName: string;
  password: string;
};

export type IPost = {
  id: string;
  creatorId: string;
  caption: string;
  tags: string[];
  location: string | null;
  created_at: string;
  creator: {
    id: string;
    name: string;
    userName: string;
    imageUrl: string | null;
  };
  image: {
    url: string;
  }[];
  likedPosts: {
    id: string;
    name: string;
    userName: string;
    imageUrl: string | null;
  }[];
  saves: boolean;

}

export type Ifollow = {
  userId: string;
  action: 'follow'
}

export type IUnfollow = {
  userId: string;
  action: 'unfollow'
}