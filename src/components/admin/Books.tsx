import BookForm from "../../components/admin/BookForm";
import BookTable from "../../components/admin/BookTable";
import { useAppSelector } from "../../hooks/reduxHooks";

const Books = () => {
  const { books } = useAppSelector((s) => s.books);

  return (
    <div>
      <h1>Books</h1>
      <BookForm />
      <BookTable books={books} />
    </div>
  );
};

export default Books;