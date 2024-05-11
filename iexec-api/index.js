import express from 'express';
import { IExecWeb3mailManager } from './services/iExecWeb3mail.mjs';
import { IExecDataProtectorManager } from './services/iExecDataProtector.mjs';
const app = express();
const mailManager = new IExecWeb3mailManager("bellecour");
const dataProtectorManager = new IExecDataProtectorManager()

// Middleware to parse json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Allow connections from any origin
  res.header('Access-Control-Allow-Origin', '*');

  // Allow methods and headers for CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle pre-flight requests for CORS
  if (req.method === 'OPTIONS') {
      res.send(200);
  } else {
      next();
  }
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/sendMailToAll", (req, res) => {
  mailManager.sendEmailToAllContacts();
  return res.status(200).json({
    message: "Request sent!",
  });
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const data = await dataProtectorManager.protectEmailAndGrantAccess(email)
    return res.status(200).json({
      message: `Email ${email} successfully subscribed with tx: ${data.txHash} at the address: ${data.dataset}`,
      data,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Uncomment to test in local
app.listen('3000', () => {
  console.log(`Server is running at http://localhost:3000`);
});
