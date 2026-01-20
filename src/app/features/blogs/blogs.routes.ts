import { Routes } from "@angular/router";
import { BlogDetail } from "./pages/blog-detail/blog-detail";
import { BlogList } from "./pages/blog-list/blog-list";
import { BlogEditor } from "./pages/blog-editor/blog-editor";

export const BLOG_ROUTES: Routes = [
  { path: '', component: BlogList },
  { path: 'new', component: BlogEditor },
  { path: ':id', component: BlogDetail },
];