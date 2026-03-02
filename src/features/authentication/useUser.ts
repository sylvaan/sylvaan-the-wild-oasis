import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

// We can define a loose interface here or cast the data if needed since TS complains about role.
export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    isLoading,
    user,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isAuthenticated: (user as any)?.role === "authenticated",
  };
}
