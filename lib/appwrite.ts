import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";


export const appwriteConfig = {
   endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
   projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
   platform: 'com.kantee.chow',
   databaseId:'68b0de3d00296c3816b7',
   userCollectionId:'user',
}

export const client = new Client();

client
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.projectId)
.setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const database = new Databases(client);
export const avatar = new Avatars(client);

export const createUser = async ({email, password, name}:CreateUserParams) => {

   try {
      const newAccount = await account.create(ID.unique(), email, password, name)
      if(!newAccount) throw Error;

      await signIn({email, password});

      const avatarUrl = avatar.getInitialsURL(name);

     return await database.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         { email, name, accountid: newAccount.$id, avatar: avatarUrl}
      );

   }catch (e) {
      throw new Error(e as string);
   }
}

export const signIn = async ({email, password}:SignInParams) => {
   try {
      const session = await account.createEmailPasswordSession(email,password);
   } catch (e) {
      throw new Error(e as string);
   }
}

export const getCurrentUser = async () => {
   try{
      const currentAccount = await account.get();
      if(!currentAccount) throw Error;

      const currentUser = await database.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal('accountid', currentAccount.$id)]
      )

      if (!currentUser) throw Error;

      return currentUser.documents[0];
   }catch(e){
      console.log(e);
      throw new Error (e as string)
   }
}