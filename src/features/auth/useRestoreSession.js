import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileQuery } from "../../api/authApi";
import { selectCurrentUser, selectToken, setUser } from "./authSlice";

export function useRestoreSession() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);

  const { data } = useGetProfileQuery(undefined, { skip: !token || !!user });

  useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);
}