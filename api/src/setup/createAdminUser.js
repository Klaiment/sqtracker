import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../schema/user";
import { sendVerificationEmail } from "../controllers/user";

const createAdminUser = async (mail) => {
  const existingAdmin = await User.findOne({ username: "admin" }).lean();
  if (!existingAdmin) {
    const created = Date.now();

    const hash = await bcrypt.hash("admin", 10);
    const hashPublicUser = await bcrypt.hash(
      (Math.random() + Math.random()).toString(34),
      10
    );

    const adminUser = new User({
      username: "admin",
      email: process.env.SQ_ADMIN_EMAIL,
      role: "admin",
      password: hash,
      created,
      remainingInvites: Number.MAX_SAFE_INTEGER,
      emailVerified: process.env.SQ_DISABLE_EMAIL,
    });
    const publicUser = new User({
      username: "public",
      email: 'public@sqtracker.dev',
      role: "user",
      password: hashPublicUser,
      created,
      remainingInvites: Number.MAX_SAFE_INTEGER,
      emailVerified: process.env.SQ_DISABLE_EMAIL,
    });
    adminUser.uid = crypto
      .createHash("sha256")
      .update(adminUser._id.toString())
      .digest("hex")
      .slice(0, 10);
    publicUser.uid ="publicUserUID";
    adminUser.token = jwt.sign(
      {
        id: adminUser._id,
        created,
        role: "admin",
      },
      process.env.SQ_JWT_SECRET
    );
    publicUser.token = jwt.sign(
        {
          id: publicUser._id,
          created,
          role: "user",
        },
        process.env.SQ_JWT_SECRET
    );

    await adminUser.save();
    await publicUser.save();

    if (!process.env.SQ_DISABLE_EMAIL) {
      const emailVerificationValidUntil = created + 48 * 60 * 60 * 1000;
      const emailVerificationToken = jwt.sign(
        {
          user: process.env.SQ_ADMIN_EMAIL,
          validUntil: emailVerificationValidUntil,
        },
        process.env.SQ_JWT_SECRET
      );
      await sendVerificationEmail(
        mail,
        process.env.SQ_ADMIN_EMAIL,
        emailVerificationToken
      );
    }

    console.log("[sq] created initial admin user");
  }
};

export default createAdminUser;
