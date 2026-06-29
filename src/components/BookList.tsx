"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Book = { n: string; title: string; author: string; desc: string };

const BOOKS: Book[] = [
  { n: "01", title: "Zero to One", author: "Peter Thiel", desc: "Why building something new beats copying what already works." },
  { n: "02", title: "$100M Offers", author: "Alex Hormozi", desc: "How to build offers people can't say no to." },
  { n: "03", title: "The Cold Start Problem", author: "Andrew Chen", desc: "How network effect products get off the ground and scale." },
  { n: "04", title: "The Dichotomy of Leadership", author: "Willink & Babin", desc: "Balancing the opposing forces of leading well." },
  { n: "05", title: "Meditations", author: "Marcus Aurelius", desc: "A Roman emperor's private notes on staying grounded." },
  { n: "06", title: "Never Split the Difference", author: "Chris Voss", desc: "An FBI negotiator's playbook for getting to yes." },
  { n: "07", title: "The Courage to Be Disliked", author: "Kishimi & Koga", desc: "Letting go of approval to live on your own terms." },
  { n: "08", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", desc: "The two ways your mind thinks, and where it fools you." },
  { n: "09", title: "Think and Grow Rich", author: "Napoleon Hill", desc: "The mindset behind building wealth." },
  { n: "10", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", desc: "Thinking about money like an investor, not an employee." },
  { n: "11", title: "The Psychology of Money", author: "Morgan Housel", desc: "How behavior, not math, drives wealth." },
  { n: "12", title: "Atomic Habits", author: "James Clear", desc: "Small habits that compound into big change." },
  { n: "13", title: "How to Win Friends and Influence People", author: "Dale Carnegie", desc: "How to connect with and win over people." },
  { n: "14", title: "Read People Like a Book", author: "Patrick King", desc: "Reading what people really think and feel." },
  { n: "15", title: "Attached", author: "Levine & Heller", desc: "Why we bond the way we do in relationships." },
  { n: "16", title: "$100M Leads", author: "Alex Hormozi", desc: "Getting a steady flow of interested buyers." },
  { n: "17", title: "$100M Money Models", author: "Alex Hormozi", desc: "Pricing that funds your own growth." },
  { n: "18", title: "Can't Hurt Me", author: "David Goggins", desc: "Pushing past your limits through discipline." },
  { n: "19", title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", desc: "Caring about less, but better." },
  { n: "20", title: "Your Next Five Moves", author: "Patrick Bet-David", desc: "Thinking moves ahead like a strategist." },
  { n: "21", title: "Emotional Intelligence", author: "Daniel Goleman", desc: "Why handling emotions beats raw IQ." },
  { n: "22", title: "Expert Secrets", author: "Russell Brunson", desc: "Turning your message into a movement." },
  { n: "23", title: "The E-Myth Revisited", author: "Michael Gerber", desc: "Building a business that runs without you." },
  { n: "24", title: "Profit First", author: "Mike Michalowicz", desc: "Taking profit off the top, every time." },
  { n: "25", title: "The Millionaire Fastlane", author: "MJ DeMarco", desc: 'Building wealth fast, not "someday."' },
  { n: "26", title: "Thinking in Systems", author: "Donella Meadows", desc: "Seeing the systems that shape everything." },
  { n: "27", title: "The New Model of Selling", author: "Miner & Acuff", desc: "Selling by asking, not pushing." },
  { n: "28", title: "The Richest Man in Babylon", author: "George S. Clason", desc: "Timeless money lessons in simple parables." },
  { n: "29", title: "The Millionaire Next Door", author: "Stanley & Danko", desc: "The quiet habits of the truly wealthy." },
];

type IndexVar = CSSProperties & { "--i"?: number };

export default function BookList() {
  const ref = useRef<HTMLOListElement>(null);

  // Reveal each row as it scrolls into view (one-shot).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const rows = root.querySelectorAll<HTMLElement>(".book-row");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <ol className="book-list" ref={ref}>
      {BOOKS.map((book, i) => (
        <li
          className="book-row"
          key={book.n}
          style={{ "--i": i % 6 } as IndexVar}
        >
          <span className="book-num">{book.n}</span>
          <div className="book-content">
            <h2 className="book-title">{book.title}</h2>
            <p className="book-author">{book.author}</p>
            <p className="book-desc">{book.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
