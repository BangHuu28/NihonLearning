import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './templates/Header';
import Menu from './templates/Menu';
import Footer from './templates/Footer';
import Home from './pages/Home';
import Alphabet from './pages/Alphabet';
import LevelDashboard from './pages/LevelDashboard';
import LessonDetail from './pages/LessonDetail';
import JLPTPrep from './pages/JLPTPrep';
import JLPTExam from './pages/JLPTExam';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import Flashcard from './pages/Flashcard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <Menu />
        <div className="app-content">
          <div className="main-content">
            <div className="row">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/alphabet" element={<Alphabet />} />
                <Route path="/levels/:level" element={<LevelDashboard />} />
                <Route path="/levels/:level/lessons/:lessonId" element={<LessonDetail />} />
                <Route path="/flashcard" element={<Flashcard />} />
                <Route path="/jlpt" element={<JLPTPrep />} />
                <Route path="/jlpt/exam/:level" element={<JLPTExam />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
