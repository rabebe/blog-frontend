**Blog Frontend**
=================

The **Blog Frontend** is a Next.js/React application for managing and viewing blog posts. It integrates with **Blog Backend API** to create, read, update, and delete posts, and includes **email verification** for secure user registration.

* * * * *

**Features**
------------

-   View blog posts in a clean, user-friendly layout

-   Allow Admin Users to create, edit, and delete blog posts (requires authentication)

-   Allow Admin to moderate and approve comments before they are posted

-   Allow authenticated users to comment and like posts

-   Email verification for new user accounts

-   Rich-text support for blog posts

-   Responsive design for desktop and mobile

-   Error handling and loading indicators for better UX

-   Integration with the backend API using the **Fetch API**

* * * * *

**Tech Stack**
--------------

-   **Next.js** (React framework)

-   **TypeScript** for type safety

-   **Tailwind CSS** for styling

-   **Fetch API** for all backend requests (posts, authentication, email verification)

-   Deployed on **Vercel** (or any preferred hosting platform)

* * * * *

**Project Structure**
---------------------


**Key pages/components:**



* * * * *

**Setup Instructions**
----------------------

1.  **Clone the repository:**

`git clone https://github.com/rabebe/blog-frontend.git cd blog-frontend `

1.  **Install dependencies:**

`npm install `

1.  **Create a `.env.local` file** in the project root with the following variable:
`NEXT_PUBLIC_API_URL: URL of your Blog Backend API (e.g., http://localhost:5000 for local testing)

1.  **Start the development server:**

    `npm run dev `

The app will be available at `http://localhost:3000`.

* * * * *

**Email Verification Flow**
---------------------------

1.  User registers on the frontend.

2.  Backend generates a verification token and sends an email.

3.  The email link points to `/verify-email?token=<token>` on the frontend.

4.  Frontend extracts the token and calls the backend verification endpoint using **Fetch**.

5.  Verification success or failure is displayed to the user.

* * * * *

**Available Scripts**
---------------------

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production version |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run format` | Runs Prettier to format code |

* * * * *

**Deployment**
--------------

-   **Build the app for production:**

    `npm run build `

-   Deploy the `.next` build folder to **Vercel**, **Netlify**, or your preferred hosting platform.

-   Make sure `.env` variables are set in your hosting environment.

* * * * *

**Contributing**
----------------

1.  Fork the repository

2.  Create a branch for your feature (`git checkout -b feature/your-feature`)

3.  Make your changes

4.  Commit your changes (`git commit -m "Add feature"`)

5.  Push your branch (`git push origin feature/your-feature`)

6.  Open a Pull Request
