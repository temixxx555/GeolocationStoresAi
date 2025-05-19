import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import fs from "fs";
import User from "../../../models/User";
import { NextResponse } from "next/server";

const serviceAccountKey = JSON.parse(
  fs.readFileSync(
    "./mern-blog-76ba3-firebase-adminsdk-fbsvc-d1015fb126.json",
    "utf-8"
  )
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export async function POST(request) {
  try {
    const { access_token } = request.body;
    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const decodedUser = await getAuth().verifyIdToken(access_token);
    let { email, name, picture } = decodedUser;
    picture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email });

    if (user && !user.google_auth) {
      return NextResponse.json(
        {
          error: "This email was signed up without Google. Use password login.",
        },
        { status: 403 }
      );
    }

    if (!user) {
      const username = await generateUsername(email);
      user = new User({
        personal_info: {
          email,
          fullname: name || email.split("@")[0],
          profile_img: picture,
          username,
        },
        google_auth: true,
      });
      await user.save();
    }
return NextResponse.json(formatDataToSend(user),{status:200});


  } catch (err) {
     console.error("Google Auth Error:", err);
    return NextResponse.json({ error: "Failed to authenticate" },{status:500});
  }
}
