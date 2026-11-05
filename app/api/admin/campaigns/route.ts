import { createContent } from "../../../../lib/managed-content";

export async function POST(request: Request) {
  return createContent(request, "campaigns");
}
