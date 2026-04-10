import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    axios.get("http://localhost:3000")
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <h1 className="text-3xl font-bold text-green-500">
      Conectando frontend con backend
    </h1>
  );
}

export default App;