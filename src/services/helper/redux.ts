import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "../../types/type/redux.type";




export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSeletor: TypedUseSelectorHook<RootState> = useSelector;