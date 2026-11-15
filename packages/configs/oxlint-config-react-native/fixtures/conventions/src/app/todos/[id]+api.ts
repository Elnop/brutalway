export function GET(_request: Request, params: { id: string }): Response {
  return Response.json({ id: params.id });
}

export function DELETE(): Response {
  return new Response(null, { status: 204 });
}
