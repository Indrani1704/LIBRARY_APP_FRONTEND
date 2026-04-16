import type { Book } from "../../types/type/index";

interface Props {
  books: Book[];
}

const BookTable = ({ books }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Genre</th>
        </tr>
      </thead>

      <tbody>
        {books.map((b) => (
          <tr key={b._id}>
            <td>{b.title}</td>
            <td>{b.price}</td>
            <td>{b.genre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;