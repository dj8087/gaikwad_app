import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useAuthData = () => {
  const authData = useSelector((state: RootState) => state.auth.data);
  const profileData = useSelector((state: RootState) => state.profile.data);

  const authRaw = authData?.data;
  const profileRaw = profileData?.data;

  /* ---------------- TOKEN ---------------- */
  const token = authRaw?.customerToken ?? null;

  /* ---------------- USER ---------------- */
  const user = profileRaw
    ? {
        id: profileRaw.authCode ?? null,
        name: profileRaw.name ?? null,
        mobile: profileRaw.mobile ?? null,
        city: profileRaw.city ?? null,
      }
    : null;

  return {
    /* raw (if ever needed) */
    authRaw,
    profileRaw,

    /* auth meta */
    token,
    success: authRaw?.success ?? false,
    message: authRaw?.message ?? "",

    /* user info (clean) */
    user,
  };
};
