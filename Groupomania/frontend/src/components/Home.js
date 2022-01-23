import React from 'react';

import Banner from "./Banner";
import PostsList from "./PostsList";
import SendPost from "./PostForm";

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