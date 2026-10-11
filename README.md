# gptCloneProject

# Conversational Intelligence Workspace

this project is a full-stack conversational web application built to practice decoupled client-server architecture, asynchronous event handling, and modern chat interfaces.

## 🚀 Live Demo
Experience the live deployed application here: **[Deployed Page]([https://chatgpt-clone-black-nu.vercel.app/])**

## 📁 Repository Structure
The project is divided into two decoupled modules to maximize scalability:
* **`frontend/`**: The client-side conversational interface layout and state controller.
* **`backend/`**: The core API runtime engine handling token transfers and system requests.

## ✨ Core Engineering Features
* **Decoupled Architecture:** Clean boundary line separating client interfaces and back-end application logic.
* **Asynchronous Streams:** Fast message state management optimizing processing feedback and UI rendering.
* **Responsive Workspace View:** Fluidly scales across multiple devices (mobile, tablet, desktop) for seamless testing.
* **Isolate Configuration:** Protected environmental security parameters for localized development instances.

---

## 📦 Local Setup & Configuration

Follow these sequential steps to run the complete environment on your machine:

### 1. Initialize the Repository
```bash
git clone https://github.com/yabets123d-ux/gptCloneProject.git
cd gptCloneProject
```

### 2. Configure and Run the Backend Engine
1. Navigate into the backend module directory:
   ```bash
   cd backend
   ```
2. Create and fill in your localized configuration rules:
   ```bash
   cp .env.example .env
   ```
   *(Open `.env` and assign your backend server ports and internal secret tokens)*
3. Install dependencies and fire up the backend engine:
   ```bash
   npm install
   npm run start
   ```

### 3. Configure and Run the Frontend Interface
1. Open a new terminal instance and jump into the frontend directory:
   ```bash
   cd frontend
   ```
2. Link your environment hooks if applicable:
   ```bash
   cp .env.example .env
   ```
   *(Point your client-side environment targets to your active backend address, e.g., `http://localhost:5000`)*
3. Install platform dependencies and spin up your development pipeline:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛡️ License
This repository is open-source and structured for educational architecture analysis and portfolio presentation under the [MIT License](LICENSE).
