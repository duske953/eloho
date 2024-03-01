import 'dotenv/config';
import compression from 'compression';
import express from 'express';
import validator from 'validator';
import minifyHTML from 'express-minify-html';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import cors from 'cors';
import { sendEmail } from './controller/sendMail.js';

const app = express();
app.use(express.json());
app.use(xss());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': [
          "'self'",
          'https://img.icons8.com',
          'https://cdnjs.cloudflare.com',
        ],
        'script-src': [
          "'self'",
          'https://unpkg.com/ionicons@7.1.0/dist/ionicons/',
        ],
        'default-src': [
          "'self'",
          'https://unpkg.com/ionicons@7.1.0/dist/ionicons/',
        ],
      },
    },
  })
);
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);
app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    validate: {
      trustProxy: false,
    },
  })
);
app.post('/', (req, res, next) => {
  if (!InputValidator(req, res, next)) return;
  console.log(req.body);
  sendEmail(
    `Message from ${req.body.name}`,
    `${req.body.message} \n From: ${req.body.email}`,
    res
  );
});

function InputValidator(req, res, next) {
  const input = [req.body.name, req.body.message, req.body.email];
  if (input.some((el) => el.trim().length === 0)) {
    res.status(400).send('Something went wrong with this request');
    return false;
  }
  if (!validator.isEmail(req.body.email)) {
    res.status(400).send('Something went wrong with this request');
    return false;
  }
  return true;
}

app.listen(3000, () => console.log('good over here'));
