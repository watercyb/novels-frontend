import { Link } from "react-router-dom";
import { t } from "i18next";
import useAdminStore from "../../admin/UseAdminStore";

const UpdateRoleRequestMessage = ({ message }) => {
  const username = message.sender?.username;
  const { getUsers } = useAdminStore();

  return (
    <p>
      <Link
        to={"/admin/users"}
        onClick={() => getUsers(message.sender.id)}
        className="link link-primary font-semibold"
      >
        {username}
      </Link>
      {t("request_update_role")}
    </p>
  );
};

export default UpdateRoleRequestMessage;
