import { sign } from "hono/jwt";

export async function hashPassword(password: string) {
  return await Bun.password.hash(password);
}

export async function checkPassword(password: string, hash: string) {
  return await Bun.password.verify(password, hash);
}

export async function createToken(payload: {
  sub: string;
  email: string;
  isAdmin: boolean;
}) {
  return sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.JWT_SECRET ?? "",
  );
}
