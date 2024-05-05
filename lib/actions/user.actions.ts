"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const res = await account.createEmailPasswordSession(email, password);

    return parseStringify(res);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const signUp = async (userData: SignUpParams) => {
  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      `${userData.firstName} ${userData.lastName}`
    );
    const session = await account.createEmailPasswordSession(
      userData.email,
      userData.password
    );

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (err) {
    console.log("Error: ", err);
  }
};

export async function logout() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}
