// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Feed from "./components/Feed";
import ProfilePage from "./pages/profile/{id}";
import PostPage from "./pages/post/{id}";
import OffersPage from "./pages/offers/OffersPage";
import CommunitiesPage from "./pages/communities/CommunitiesPage";
import MessagesPage from "./pages/messages/MessagesPage";

const apiUrl = 'http://localhost:3000';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/yovendo/" element={<OffersPage />} />
        <Route path="/comunidades/" element={<CommunitiesPage />}/>
        <Route path="/messages" element={<MessagesPage/>} />
        <Route path="/messages/:userId" element={<MessagesPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
