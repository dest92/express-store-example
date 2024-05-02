import express, { Request, Response } from 'express';
import { routerApi } from './routes';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

routerApi(app);

// app.get('/about', (req: Request, res: Response) => {
//   res.json({ message: 'About page' });
// });

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
