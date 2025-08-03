import axios from "axios";
import express from "express";
import cors from "cors";
import path from "path";
import url from "url";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const headers = {
 headers: {
  "User-Agent": "Mozilla/5.0",
 },
};

async function reqGET(link) {
 try {
  if (!link) {
   return {
    data: JSON.stringify({ MessageError: "Falta el link" }),
    status: 400,
    headers: { "Content-Type": "application/json" },
   };
  }

  const decodedUrl = decodeURIComponent(link);
  const pathname = new URL(decodedUrl).pathname;
  const extension = path.extname(pathname).toLowerCase();

  if (extension && extension.length > 1) {
   return {
    data: JSON.stringify({
     MessageError: "Carga de archivos no permitida",
    }),
    status: 400,
    headers: { "Content-Type": "application/json" },
   };
  }

  const response = await axios.get(decodedUrl, {
   ...headers,
   responseType: "text",
  });

  return {
   data: response.data,
   status: response.status,
   headers: response.headers,
  };
 } catch (error) {
  return {
   data: JSON.stringify({
    MessageError: "Error al procesar la solicitud",
    Detalle: error.toString(),
   }),
   status: 500,
   headers: { "Content-Type": "application/json" },
  };
 }
}

async function reqPOST(url, body) {
 try {
  const response = await axios.post(url, body, {
   ...headers,
   responseType: "text",
  });
  return {
   data: response.data,
   status: response.status,
   headers: response.headers,
  };
 } catch (error) {
  return {
   data: error.toString(),
   status: 500,
   headers: { "Content-Type": "text/plain" },
  };
 }
}

async function reqPUT(url, body) {
 try {
  const response = await axios.put(url, body, {
   ...headers,
   responseType: "text",
  });
  return {
   data: response.data,
   status: response.status,
   headers: response.headers,
  };
 } catch (error) {
  return {
   data: error.toString(),
   status: 500,
   headers: { "Content-Type": "text/plain" },
  };
 }
}

async function reqDELETE(url) {
 try {
  const response = await axios.delete(url, {
   ...headers,
   responseType: "text",
  });
  return {
   data: response.data,
   status: response.status,
   headers: response.headers,
  };
 } catch (error) {
  return {
   data: error.toString(),
   status: 500,
   headers: { "Content-Type": "text/plain" },
  };
 }
}

app.get("/", (req, res) => {
 res.setHeader("Content-Type", "text/html; charset=utf-8");
 res.send(`
    <h1>API Proxy - Ejemplos de uso</h1>
    <h2>GET</h2>
    <pre>
curl "https://proxyapi-nev5.onrender.com/get?link=https://www.example.com"
    </pre>
    <h2>POST</h2>
    <pre>
curl -X POST "https://proxyapi-nev5.onrender.com/post" \\
  -H "Content-Type: application/json" \\
  -d '{"link":"https://jsonplaceholder.typicode.com/posts","payload":{"title":"foo","body":"bar","userId":1}}'
    </pre>
    <h2>PUT</h2>
    <pre>
curl -X PUT "https://proxyapi-nev5.onrender.com/put" \\
  -H "Content-Type: application/json" \\
  -d '{"link":"https://jsonplaceholder.typicode.com/posts/1","payload":{"title":"foo","body":"bar","userId":1}}'
    </pre>
    <h2>DELETE</h2>
    <pre>
curl -X DELETE "https://proxyapi-nev5.onrender.com/delete" \\
  -H "Content-Type: application/json" \\
  -d '{"link":"https://jsonplaceholder.typicode.com/posts/1"}'
    </pre>

    <h2>Ejemplo usando fetch (JavaScript)</h2>
    <pre>
fetch('/get?link=https://www.example.com')
  .then(res => res.text())
  .then(console.log);

fetch('/post', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({link: 'https://jsonplaceholder.typicode.com/posts', payload: {title: 'foo', body: 'bar', userId: 1}})
})
  .then(res => res.json())
  .then(console.log);
    </pre>
  `);
});

app.get("/get", async (req, res) => {
 const url = req.query.link;
 const result = await reqGET(url);
 res.set(result.headers);
 res.status(result.status).send(result.data);
});

app.post("/post", async (req, res) => {
 const { link, payload } = req.body;
 const result = await reqPOST(link, payload);
 res.set(result.headers);
 res.status(result.status).send(result.data);
});

app.put("/put", async (req, res) => {
 const { link, payload } = req.body;
 const result = await reqPUT(link, payload);
 res.set(result.headers);
 res.status(result.status).send(result.data);
});

app.delete("/delete", async (req, res) => {
 const { link } = req.body;
 const result = await reqDELETE(link);
 res.set(result.headers);
 res.status(result.status).send(result.data);
});

app.listen(PORT, () => {
 console.log(`Servicio corriendo en el puerto ${PORT}`);
});


