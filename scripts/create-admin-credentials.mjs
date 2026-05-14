#!/usr/bin/env node

import { randomBytes } from "node:crypto";

const [, , email, password, ...nameParts] = process.argv;
const name = nameParts.join(" ") || "NEBULINT Admin";

function usage() {
  console.log("Usage: node scripts/create-admin-credentials.mjs admin@example.com \"StrongPassword\" \"Admin Name\"");
  console.log("");
  console.log("Copy the generated SQL into the Supabase SQL editor after running supabase/admin-auth.sql.");
}

function dollarQuote(value) {
  const tag = `nebulint_${randomBytes(6).toString("hex")}`;
  return `$${tag}$${value}$${tag}$`;
}

if (!email || !password) {
  usage();
  process.exit(1);
}

if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const emailValue = dollarQuote(email.toLowerCase());
const passwordValue = dollarQuote(password);
const nameValue = dollarQuote(name);

console.log(`-- Run supabase/admin-auth.sql first, then run this generated credential SQL.
insert into public.admin_users (email, name, password_hash, is_active)
values (
  ${emailValue},
  ${nameValue},
  crypt(${passwordValue}, gen_salt('bf')),
  true
)
on conflict (email)
do update set
  name = excluded.name,
  password_hash = excluded.password_hash,
  is_active = true,
  updated_at = now();
`);
