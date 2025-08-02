import axios from "axios";
import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const headers = {
 headers: {
  "User-Agent": "Mozilla/5.0",
 }
};

async function reqGET(url) {
 try {
  const response = await axios.get(url, { ...headers, responseType: "text" });
  return { data: response.data, status: response.status, headers: response.headers };
 } catch (error) {
  return { data: error.toString(), status: 500, headers: { "Content-Type": "text/plain" } };
}

async function reqPOST(url, body) {
 try {
  const response = await axios.post(url, body, { ...headers, responseType: "text" });
  return { data: response.data, status: response.status, headers: response.headers };
 } catch (error) {
  return { data: error.toString(), status: 500, headers: { "Content-Type": "text/plain" } };
}

async function reqPUT(url, body) {
 try {
  const response = await axios.put(url, body, { ...headers, responseType: "text" });
  return { data: response.data, status: response.status, headers: response.headers };
 } catch (error) {
  return { data: error.toString(), status: 500, headers: { "Content-Type": "text/plain" } };
}

async function reqDELETE(url) {
 try {
  const response = await axios.delete(url, { ...headers, responseType: "text" });
  return { data: response.data, status: response.status, headers: response.headers };
 } catch (error) {
  return { data: error.toString(), status: 500, headers: { "Content-Type": "text/plain" } };
}

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
