import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    document.title = "Cat Novels";
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
