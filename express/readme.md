# TechWind Shop

# Description
This web app offers seamless shopping experience with user-friendly interface and helpful features:
- Customers can view products and its details including: description, sizes, colors, material,...
- Find products with search bar, sort and filter support.
- Register and sign in to go shopping: adding products to cart and ordering. Order history is also available.
- Manage their account and view registered personal information
- Provide information for support in About us


## Implementation
0. System:
Our group use node version > 20.x
1. Clone code from Github:
``` bash
https://github.com/Phoegras/Web-dev.git
cd Web-dev/express
```
2. Install dependencies:

Use package manager [npm](https://www.npmjs.com/) to install all necessary packages
In folder express, command:

```bash
npm install
```

3. File `.env`:

In folder express, create `.env` file:
```
DATABASE_URL="mongodb+srv://thao452004:RHiRNWLxbrn8o8wQ@cluster0.lhtke.mongodb.net/test?retryWrites=true&w=majority"

CLOUD_NAME = dylup3xat
API_KEY = 778594783222528
API_SECRET = SpXIWLEZ-DVzOEKMTHikPb2prdo

APP_NAME=Tech_Wind
APP_URL=http://localhost:3000

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=walkerjoin.no5@gmail.com
MAIL_PASSWORD=mevr dayw uphn hfbl
MAIL_ENCRYPTION=TLS
MAIL_FROM_ADDRESS=walkerjoin.no5@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

BCRYPT_SALT_ROUND=10

GOOGLE_CLIENT_ID=440477753053-ea7pmh8s1nke00pi9gqk1ds7174b7sg4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

SHIPPING_FEE=3

```

## Run the project
In `express` folder, command:
```bash
npm run dev
```
The project will be started at http://localhost:3000/.

## Deploy on Host Service
Website is deployed on Render:
[TechWind Shop](https://techwindshop.onrender.com)

## Members

- 22120315 - Nguyễn Văn Tài
- 22120337 - Lương Thị Diệu Thảo

# References
1. **GitHub**
2. **ChatGPT**
3. **Youtube**
4. [**Prisma ORM**](https://www.prisma.io/docs/orm)
5. [**Cloudinary**](https://cloudinary.com/blog/guest_post/upload-images-to-cloudinary-with-node-js-and-react)