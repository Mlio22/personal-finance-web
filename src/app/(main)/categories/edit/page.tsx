import { redirect } from "next/navigation";

export default function CategoriesEditRedirectPage() {
  redirect("/categories?edit=1");
}
