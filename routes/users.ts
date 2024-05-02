import express, { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
const router = express.Router();
const usersService = UsersService.getInstance();
interface User {
  id: number;
  name: string;
  email: string;
}

router.get('/', async (req: Request, res: Response) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 5000); //Timeout after 5 seconds
  });
  const usersPromise = usersService.getUsers();

  try {
    //Wait for either the categories to be fetched or the timeout to occur
    const categories = await Promise.race([usersPromise, timeoutPromise]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/filter', async (req: Request, res: Response) => {
  res.json({ message: 'Filter users' });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'Invalid id' });
  }
  const user = await usersService.findUser(Number(id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.post('/addUser', async (req: Request, res: Response) => {
  const { id, name, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const newUser: User = {
    id: Number(id),
    name: String(name),
    email: String(email),
  };

  usersService.addUser(newUser);
  res.json({ message: 'User added' });
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const updatedUser: User = {
    id: Number(id),
    name: String(name),
    email: String(email),
  };

  usersService.updateUser(Number(id), updatedUser);
  res.json({ message: 'User updated' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  usersService.deleteUser(Number(id));
  res.json({ message: 'User deleted' });
});

export default router;
