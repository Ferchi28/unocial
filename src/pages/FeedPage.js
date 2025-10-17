import React from 'react';
import Header from '../components/Header';
import Feed from '../components/Feed';

function FeedPage({ username, onLogout }) {
  return (
    <div className="page feed-page">
      <Header username={username} onLogout={onLogout} />
      <Feed />
    </div>
  );
}

export default FeedPage;
