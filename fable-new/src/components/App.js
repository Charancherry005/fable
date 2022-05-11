import { ThemeContext } from "./ThemeContext";
import React, { useContext } from "react";
import "../App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Home from "./Home/HomeImage";
import Navigation from "./Navigation";
import SignUp from "./SignUp";
import { AuthProvider } from "../firebase/Auth";
import PrivateRoute from "./PrivateRoute";
import Splash from "./Splash";
import CreateStory from "./Stories/CreateStory";
import Story from "./Stories/Story";
import PublicProfile from "./Users/PublicProfile";
import EditUser from "./Users/EditUser";
import StoryBook from "./Stories/StoryBook";
import CreateLibrary from "./Libraries/CreateLibrary";
import ViewLibrariesList from "./Libraries/ViewLibrariesList";
import Signin from "./Signin";
import ManageMyStories from "./Stories/ManageMyStories";
import Footer from "./Footer";
import Carousel from "./Home/Carousel.js"

function App() {
  const context = useContext(ThemeContext);
  //const darkMode = context.theme.darkMode;
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <header className="App-header">
            <Navigation />
          </header>
          </div>
          <div> <Carousel /></div>
          
         
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>
           
            <Route path="/account" element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/stories/create_story" element={<PrivateRoute />}>
              <Route path="/stories/create_story" element={<CreateStory />} />
            </Route>
            <Route path="/carousel" element={<PrivateRoute />}>
            <Route path="/carousel" element={<Carousel />} />
            </Route>
            <Route path="/stories/:id" element={<PrivateRoute />}>
              <Route path="/stories/:id" element={<Story />} />
            </Route>
            <Route path="/users/:profileUserId" element={<PrivateRoute />}>
              <Route path="/users/:profileUserId" element={<PublicProfile />} />
            </Route>
            <Route path="/users/:userId/edit" element={<PrivateRoute />}>
              <Route path="/users/:userId/edit" element={<EditUser />} />
            </Route>
            <Route path="/stories/:storyId/book" element={<PrivateRoute />}>
              <Route path="/stories/:storyId/book" element={<StoryBook />} />
            </Route>
            <Route path="/stories/manage" element={<PrivateRoute />}>
              <Route path="/stories/manage" element={<ManageMyStories />} />
            </Route>
            <Route path="/libraries/create" element={<PrivateRoute />}>
              <Route path="/libraries/create" element={<CreateLibrary />} />
            </Route>
            <Route path="/libraries/me" element={<PrivateRoute />}>
              <Route path="/libraries/me" element={<ViewLibrariesList />} />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </div>
       </Router>
      <div className="page-container">
          <footer className="App-footer">
            <Footer />
          </footer>
          </div>
    </AuthProvider>
  );
}

export default App;
