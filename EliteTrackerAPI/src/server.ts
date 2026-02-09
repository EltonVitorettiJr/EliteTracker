import "dotenv/config";
import express from "express";
import { setupMongo } from "./database";
import { routes } from "./routes/routes";

//cria uma instancia do express com todas suas funções
const app = express();

// inicia a conexao com o banco antes de iniciar o servidor
setupMongo()
  .then(() => {
    //permite que o express entenda o json
    app.use(express.json());

    //permite que o express use as rotas
    app.use(routes);

    app.listen(3000, () => {
      console.log("🚀Server started on port 3000!");
    });
  })
  .catch((err) => console.error(err.message));

export default app;
