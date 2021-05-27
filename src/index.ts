import * as config from 'config'
import * as express from 'express'
import  {Request, Response} from 'express'

const app = express();
const PORT = config.get('serverPort');
app.get('/', (req: Request, res: Response) => res.send("woot"));
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});