export type UserRole = 
  | "state"
  | "district"
  | "revenue"
  | "planning"
  | "ngo"
  | "mota";

export const login = (role: UserRole) => {
  localStorage.setItem("auth", "authenticated");
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("role");
};

export const getRole = (): UserRole | null => {
  return localStorage.getItem("role") as UserRole | null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("auth") === "authenticated";
};
