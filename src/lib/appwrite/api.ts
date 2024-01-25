import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
            accountid: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            image: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.log(error)
        return error;
    }
}


export async function saveUserToDB(user: {
    accountid: string;
    email: string;
    name: string;
    image: URL;
    username?: string;
}) {
    console.log("usuário", user)
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
            console.log("saveUserToDB!!", error)
    }
}

export async function signInAccount(user: {email: string; password: string;}) {
    try {   
        const session = await account.createEmailSession(user.email, user.password)

        return session;
    } catch (error) {
        console.log(error)
    }
    
}

export async function getCurrentUser() {
    try {
        
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log("getCurrentUser error!!", error)  
        return null;
     }
}

export async function signOutAccount() {
    console.log("oi")
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.log(error);
    }
}