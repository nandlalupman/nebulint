import { changeContent } from "../../../../../lib/managed-content";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  return changeContent(request, "works", params);
}

export async function DELETE(request: Request, { params }: Context) {
  return changeContent(request, "works", params);
}
