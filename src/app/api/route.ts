/*import connectToDatabase from '../../db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API /connect is called");
  try {
    await connectToDatabase();
    res.status(200).json({ message: "Connected to database!" });
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({ error: "Failed to connect to the database." });
  }
}*/

/*export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {}

export async function GET() {
    const res = await fetch('https://data.mongodb-api.com/...', {
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.DATA_API_KEY,
      },
    })
    const data = await res.json()
   
    return Response.json({ data })
}*/
/*import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Logic for handling GET requests
  const data = { message: 'Hello, world!' };
  return NextResponse.json(data);
}
*/
// export const dynamic = 'force-dynamic' // defaults to auto
// export async function GET(request: Request) {
//     //return new Response('Hello world!');
//     return new Response(JSON.stringify({ message: 'Hello world!' }), {
//         headers: { 'Content-Type': 'application/json' },
//     });
// }


import { NextResponse } from 'next/server';
import connectToDatabase from '../../db';

export async function GET(req: Request) {
  console.log("in route.ts");
  try {
    await connectToDatabase();
    //const data = { message: "Connected to the database!" }; // Replace with actual data fetching logic
    //return NextResponse.json(data, { status: 200 });
    console.log("connected in route.ts!");
    return NextResponse.json({ message: "Connected!" }, { status: 200 });
  } catch (error) {
    console.log("not connected in route.ts");
    console.error(error);
    return NextResponse.json({ error: 'Error connecting to the database.' }, { status: 500 });
  }
}
