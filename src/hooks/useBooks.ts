import { useMemo } from "react";
import { useAppSelector } from "../hooks/reduxHooks";

export const useBooks = () => {

  const books = useAppSelector((s) => s.books?.books || []);

  const latestBooks = useMemo(() => {
    return books.slice(0, 10); // or based on createdAt if needed
  }, [books]);

  const bestSeller = useMemo(() => {
    return books.filter((b: any) => b.isBestSeller);
  }, [books]);

  return {
    books,
    latestBooks,
    bestSeller,
  };
};