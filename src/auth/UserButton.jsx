import { useEffect } from "react";
import useUserStore from "./useUserStore";
import avatar from "../assets/avatar.png";

const UserButton = () => {
  const { user, login } = useUserStore();

  useEffect(() => {
    if (!user) login("bbb@bbb.com", "11111111");
  }, [login, user]);

  return (
    <button className="btn btn-ghost btn-circle">
      <img
        src={user?.avatarUrl || avatar}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
    </button>
  );
};

export default UserButton;
