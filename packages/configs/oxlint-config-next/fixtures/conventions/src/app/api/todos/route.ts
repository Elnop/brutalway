export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export function generateStaticParams(): { id: string }[] {
  return [];
}

export function GET(): Response {
  return Response.json([]);
}

export async function POST(request: Request): Promise<Response> {
  return Response.json(await request.json(), { status: 201 });
}

export function DELETE(): Response {
  return new Response(null, { status: 204 });
}
