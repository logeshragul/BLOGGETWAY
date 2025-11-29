import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostList from './pages/PostList';
import PostEditor from './pages/PostEditor';
import PublicBlog from './pages/PublicBlog';
import PostPreview from './pages/PostPreview';
import AIChat from './pages/AIChat';
import AdminLogin from './pages/AdminLogin';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import { authService } from './services/auth';

// Protected Route Wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicBlog />} />
          <Route path="/blog" element={<PublicBlog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/preview" element={<PostPreview />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><PostList /></ProtectedRoute>} />
          <Route path="/admin/new-post" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
          <Route path="/admin/edit-post/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
          <Route path="/admin/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;