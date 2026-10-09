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

  const reset =
    process.argv.includes("--reset") ||
    process.env.ADMIN_RESET === "true" ||
    process.env.npm_lifecycle_event === "create-admin:reset";

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    if (!reset) {
      console.error(
        "An administrator with this email already exists. Run with --reset or ADMIN_RESET=true to update the password.",
      );
      process.exit(1);
    }
    existing.passwordHash = passwordHash;
    existing.active = true;
    await existing.save();
    console.log(`Administrator password updated for ${email.toLowerCase()}.`);
  } else {
    await AdminUser.create({
      email: email.toLowerCase(),
      passwordHash,
      name: "League Owner",
      role: "owner",
    });
    console.log(`Administrator created: ${email.toLowerCase()}`);
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
