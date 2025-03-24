// import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Router/routes";
// import "font-awesome/css/font-awesome.min.css";
import ReaderChatBot from "./Components/ChatBot/ReaderChatBot";

function App() {
  return (
    <div>
      <AppRoutes />
      <ReaderChatBot />
    </div>
  );
}

export default App;
