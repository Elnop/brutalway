export const unstable_settings = { matcher: { patterns: ['/api'] } };

export default function middleware(request: Request): Response | undefined {
  if (request.headers.get('authorization') === null) return new Response(null, { status: 401 });
  return undefined;
}
