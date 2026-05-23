import { useParams } from "react-router-dom";

const AuthorPage = () => {
  const { authorId } = useParams();

  return <div>{authorId}</div>;
};

export default AuthorPage;
