import Banner from "./Banner";
import PostsList from "./PostsList";
import SendPost from "./SendPost";

function Home() {
  return (
    <div>
      <Banner />
      <PostsList />
      <SendPost />
    </div>
  );
}
export default Home