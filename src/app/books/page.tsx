import type { Metadata } from "next";
import BookList from "@/components/BookList";

export const metadata: Metadata = {
  title: "Books — Oskar Tang",
  description: "Some books I have read.",
};

export default function BooksPage() {
  return (
    <main className="books">
      <header className="books-head">
        <p className="books-eyebrow">Reading list</p>
        <h1 className="books-title">Books</h1>
        <p className="books-sub">Some books I have read.</p>
        <p className="books-count">Feel free to recommend more.</p>
      </header>

      <BookList />
    </main>
  );
}
