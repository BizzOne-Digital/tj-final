import "dotenv/config";
import readline from "readline";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectMongoose } from "../src/lib/db/mongoose";
import { AdminUser } from "../src/models/AdminUser";

async function promptHidden(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const conn = await connectMongoose();
  if (!conn) {
    console.error("MONGODB_URI must be set.");
    process.exit(1);
  }

  let email = process.env.ADMIN_EMAIL?.trim();
  let password = process.env.ADMIN_PASSWORD;

  if (!email) {
    email = await promptHidden("Admin email: ");
  }
  if (!password) {
    password = await promptHidden("Admin password (min 8 chars): ");
  }

  if (!email || !email.includes("@")) {
    console.error("Valid ADMIN_EMAIL required.");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error("An administrator with this email already exists. Password was not changed.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await AdminUser.create({
    email: email.toLowerCase(),
    passwordHash,
    name: "League Owner",
    role: "owner",
  });

  console.log("Administrator created successfully.");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
