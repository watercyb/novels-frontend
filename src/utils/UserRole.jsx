import { User, PenTool, Shield, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const UserRole = ({ user }) => {
  const { t } = useTranslation();

  if (!user) return <></>;
  return (
    <>
      {user.role === "USER" && <User className="text-gray-500 size-5" />}
      {user.role === "AUTHOR" && <PenTool className="text-blue-600 size-5" />}
      {user.role === "ADMIN" && <Shield className="text-amber-600 size-5" />}
      {user.role === "SUPERADMIN" && (
        <ShieldCheck className="text-purple-600 size-5" />
      )}
    </>
  );
};

export default UserRole;
