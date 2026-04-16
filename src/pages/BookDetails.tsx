import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { addToCart } from "../store/slices/cartSlice";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // ✅ FIX typing
  const book = useAppSelector((s: any) =>
    s.books?.books?.find((b: any) => String(b._id) === String(id))
  );

  if (!book) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <div className="row">

        <div className="col-md-5">
          <img src={book.image} style={{ width: "100%" }} />
        </div>

        <div className="col-md-7">
          <h2>{book.title}</h2>
          <h4>{book.author?.name}</h4>
          <p>{book.description}</p>
          <h3>₹{book.price}</h3>

          <button
            onClick={() => dispatch(addToCart(book._id))} // ✅ FIX
            className="btn btn-warning"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}