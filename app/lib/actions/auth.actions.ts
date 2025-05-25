"use server";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const one_month = 60 * 60 * 24 * 14;
export async function Signup(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (error: any) {
    console.error("Error creating a user: ", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    if (error.code === 7 || error.message.includes("PERMISSION_DENIED")) {
      return {
        success: false,
        message:
          "Permission denied. Please check Firestore rules or IAM permissions.",
      };
    }

    return {
      success: false,
      message: "Failed to create an account.",
    };
  }
}

export async function Signin(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    await setSessionCookie(idToken);
    return {
      success: true,
      message: "User login successfully.",
    };
  } catch (error) {
    console.error("error in signin: ", error);
    return {
      success: false,
      message: "Error in user signin",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: one_month * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: one_month,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const UserRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!UserRecord.exists) return null;

    return {
      ...UserRecord.data(),
      id: UserRecord.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie: ", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
