export const checkUserCookie = () => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "user" && value === "login") {
      return true;
    }
  }
  return false;
};
