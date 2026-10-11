import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

// Public pages remain readable when a local checkout has no Firebase config.
export function useArchiveAuth(auth) {
  const [state, setState] = useState(() => [auth?.currentUser ?? null, Boolean(auth), undefined]);
  useEffect(() => {
    if (!auth) {
      setState([null, false, undefined]);
      return undefined;
    }
    return onAuthStateChanged(auth,
      user => setState([user, false, undefined]),
      error => setState([null, false, error]));
  }, [auth]);
  return state;
}
