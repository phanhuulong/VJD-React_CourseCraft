import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'antd/dist/reset.css';;
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import { AppContext } from "./Context/AppContext";
import CreateCourse from "./Courses/CreateCourse";
import CourseOfMe from "./Courses/CourseOfMe";
import UpdateCourse from "./Courses/UpdateCourse";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DetailCourse from "./Courses/DetailCourse";

export default function App() {
  const { user } = useContext(AppContext) ?? { user: null };
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/course/create" element={user ? <CreateCourse /> : <Login />} />
          <Route path="/my-courses" element={<CourseOfMe />} />;
          <Route path="/update-course/:id" element={<UpdateCourse />} />
          <Route path="/course/:id" element={<DetailCourse />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}
