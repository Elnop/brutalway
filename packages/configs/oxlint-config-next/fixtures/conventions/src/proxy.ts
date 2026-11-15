export function proxy(request: Request): Response | undefined {
  if (new URL(request.url).pathname === '/old') return Response.redirect(new URL('/', request.url));
  return undefined;
}

export const config = { matcher: ['/old'] };
