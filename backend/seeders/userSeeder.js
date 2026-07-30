require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const SEED_USERS = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "changeme123",
  },
  {
    username: "demo",
    email: "demo@example.com",
    password: "demo1234",
  },
];

async function hashPassword(plainText) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

async function seedUsers() {
  console.log("Starting user seeder...\n");

  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ username: userData.username });

    if (existing) {
      console.log(`   Skipping "${userData.username}" — already exists`);
      continue;
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = new User({ ...userData, password: hashedPassword });
    await user.save();

    console.log(`Created user "${userData.username}" (${userData.email})`);
  }

  console.log("\nSeeding complete.");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected\n");
    await seedUsers();
  })
  .catch((err) => {
    console.error("Error during seeding:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("\nMongoDB disconnected");
    process.exit(0);
  });
