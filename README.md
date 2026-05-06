# 📱 Gadget Guru

![Gadget Guru Hero](src/assets/hero.png)

**Gadget Guru** is a professional, high-performance electronics recommendation and price-comparison web application. It empowers users to make informed purchasing decisions through AI-driven insights, buy-timing analysis, and a dynamic decision-support quiz.

🌐 **Website Link:** [https://needhelp-gadget.netlify.app/](https://needhelp-gadget.netlify.app/)
📂 **Repository:** [https://github.com/Adarsh011732/Gadget_Guru](https://github.com/Adarsh011732/Gadget_Guru)

---

## ✨ Key Features

- **🧠 AI-Powered Decision Support:** An interactive product recommendation quiz that matches users with their ideal gadgets based on budget and preferences.
- **📊 Buy-Timing Analysis:** Intelligent insights regarding price trends and historical sale windows to help users decide whether to buy now or wait for discounts.
- **🔍 Smart Product Discovery:** Advanced search functionality and robust product categorization (Mobiles, Laptops, Accessories).
- **🎨 Premium UI/UX:** A visually stunning interface featuring modern design aesthetics, responsive layouts, and smooth micro-animations using Framer Motion.
- **🔐 Secure Authentication:** Complete user registration and login system protected by JSON Web Tokens (JWT) and bcrypt password hashing.
- **⚡ High Performance:** Built with React 19 and Vite for lightning-fast page loads and optimal user experience.

## 🛠️ Technology Stack

**Frontend:**
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Vanilla CSS (Custom Premium Design)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)
- React Router DOM

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- JWT Authentication & bcryptjs
- Nodemailer

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

The project has been separated into two distinct environments: `frontend` and `backend`. You will need two terminal windows to run the application locally.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adarsh011732/Gadget_Guru.git
   cd Gadget_Guru
   ```

2. **Backend Setup:**
   Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory using `backend/.env.example` as a template and add your required keys. Then start the server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` to view the application. The frontend securely communicates with the backend API running on `http://localhost:5000`.

## 📂 Project Structure

```text
Gadget_guru/
├── backend/             # Node.js/Express Server
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # API endpoint routes
│   ├── services/        # External services (Nodemailer, SerpApi, etc.)
│   ├── .env.example     # Template for environment variables
│   └── package.json     # Backend dependencies
├── frontend/            # React/Vite Application
│   ├── public/          # Static public assets
│   ├── src/             # React application source code
│   │   ├── assets/      # Images, SVGs, and other media
│   │   ├── context/     # React Context (AuthContext)
│   │   ├── pages/       # Application pages
│   │   └── services/    # Frontend API call integrations
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite bundler configuration
└── README.md            # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Adarsh011732/Gadget_Guru/issues).

## 📝 License

This project is licensed under the [MIT License](LICENSE).
