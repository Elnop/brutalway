import { todoApi } from '@/features/todo-api/lib/todoApi.ts';

type ApiRouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: ApiRouteContext): Promise<Response> {
  return todoApi(request, (await params).path);
}

export async function POST(request: Request, { params }: ApiRouteContext): Promise<Response> {
  return todoApi(request, (await params).path);
}

export async function PATCH(request: Request, { params }: ApiRouteContext): Promise<Response> {
  return todoApi(request, (await params).path);
}

export async function DELETE(request: Request, { params }: ApiRouteContext): Promise<Response> {
  return todoApi(request, (await params).path);
}
