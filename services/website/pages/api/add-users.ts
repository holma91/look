import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const email = request.body.email as string;
    if (!email) throw new Error('Email is required');

    await sql`INSERT INTO Users (Email) VALUES (${email});`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const users = await sql`SELECT * FROM Users;`;
  return response.status(200).json({ users });
}
