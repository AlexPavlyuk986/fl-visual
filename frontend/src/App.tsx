import Header from "./components/Header";
import GraphArea from "./components/GraphArea";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
        <div className="app-container">

            <Header />

            <GraphArea />

            <Footer />

        </div>
    );
}

export default App;