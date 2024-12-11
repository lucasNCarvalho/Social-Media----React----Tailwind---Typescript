export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",

    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",
    GET_USER_IS_FOLLOWING_USER_ID = "getUserIsFollowingUserId",
    GET_FOLLOWING_LIST_BY_USER_ID = "getFollowingListByUserId",
    GET_FOLLOWERS_LIST_BY_USER_ID = "getFollowersListByUserId",

    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",
    GET_POST_BY_USER_ID = "getpostByUserId",
    GET_POSTS_SAVED_BY_USER_ID = "getPostsSavedByUserId",
    GET_LIST_LIKES_BY_POST = "getListLikesByPost",
    GET_MOST_LIKED_POSTS_THIS_WEEK = "getMostLikedPostsThisWeek",
    

    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
    SEARCH_USER = "getSearchUser",
    
    // SAVED KEYS

    GET_SAVED_POSTS = "getSavedPosts"
}