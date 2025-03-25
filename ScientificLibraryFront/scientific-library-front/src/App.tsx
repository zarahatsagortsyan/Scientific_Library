// import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Router/routes";
// import "font-awesome/css/font-awesome.min.css";
import ReaderChatBot from "./Components/ChatBot/ReaderChatBot";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <div>
      <AppRoutes />
      <ReaderChatBot />
      <Footer />
    </div>
  );
}

export default App;
