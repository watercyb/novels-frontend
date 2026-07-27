import { User, PenTool, Shield, ShieldCheck } from "lucide-react";

const UserRole = ({ user }) => {

  if (!user) return <></>;
  return (
    <>
      {user.role === "USER" && <User className="text-blue-500 size-5" />}
      {user.role === "AUTHOR" && <PenTool className="text-green-500 size-5" />}
      {user.role === "ADMIN" && <Shield className="text-purple-600 size-5" />}
      {user.role === "SUPERADMIN" && (
        <ShieldCheck className="text-amber-600 size-5" />
      )}
    </>
  );
};

export default UserRole;
