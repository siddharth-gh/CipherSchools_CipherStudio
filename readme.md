# ⚡ CipherStudio — Online IDE (Full Stack Project)

An advanced **web-based code editor and project manager** built with **React**, **Node.js**, **Express**, **MongoDB**, and **AWS S3** — featuring a live coding environment powered by **Sandpack** (CodeSandbox’s open-source engine).

> 💻 Create, edit, save, and run full React projects — directly in your browser.

---

## 🚀 Features

### 🧠 Core IDE

* 💡 **Live code editor** with syntax highlighting (powered by Sandpack)
* 🧩 **Multi-file support** — manage files and folders like VS Code
* ⚙️ **Live React preview** (instantly updates as you type)
* 💾 **Save code directly to AWS S3** with MongoDB metadata
* 📁 **Create / Rename / Delete files & folders**
* 🧱 **Automatic React boilerplate generation** for new projects
* 🔐 **User authentication** (login/signup)
* ☁️ **Persistent project storage** via MongoDB

---

## 🧩 Tech Stack

### 🖥️ Frontend

* **React (Vite)** — SPA architecture
* **Tailwind CSS** — modern UI styling
* **Sandpack React** — embedded code editor + preview
* **Lucide React** — icons
* **React Context API** — authentication state

### ⚙️ Backend

* **Node.js + Express.js** — REST API
* **MongoDB + Mongoose** — data persistence
* **AWS S3** — file storage
* **UUID** — unique S3 key generation

---

## 🧱 Folder Structure

```
cipherstudio/
├── backend/
│   ├── controllers/
│   │   ├── fileController.js
│   │   ├── folderController.js
│   │   └── projectController.js
│   ├── models/
│   │   ├── File.js
│   │   ├── Folder.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── fileRoutes.js
│   │   ├── folderRoutes.js
│   │   └── projectRoutes.js
│   ├── config/
│   │   ├── db.js
│   │   └── s3.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### 🧩 Backend (`.env`)

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

### 🖥️ Frontend (`.env`)

```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🧠 Key API Endpoints

### 🔹 Files

| Method   | Endpoint                | Description                    |
| -------- | ----------------------- | ------------------------------ |
| `POST`   | `/api/files`            | Create new file & upload to S3 |
| `GET`    | `/api/files/:id`        | Fetch file content from S3     |
| `PUT`    | `/api/files/:id`        | Update file content            |
| `DELETE` | `/api/files/:id`        | Delete file                    |
| `PATCH`  | `/api/files/:id/rename` | Rename file                    |

### 🔹 Folders

| Method   | Endpoint                            | Description               |
| -------- | ----------------------------------- | ------------------------- |
| `POST`   | `/api/folders`                      | Create a new folder       |
| `GET`    | `/api/folders/:parentId?projectId=` | Fetch folder contents     |
| `DELETE` | `/api/folders/:id`                  | Delete folder recursively |
| `PATCH`  | `/api/folders/:id/rename`           | Rename folder             |

### 🔹 Projects

| Method | Endpoint                | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| `POST` | `/api/projects`         | Create new project with boilerplate files |
| `GET`  | `/api/projects?userId=` | Fetch user projects                       |

---

## 💾 How to Run Locally

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/<your-username>/cipherstudio.git
cd cipherstudio
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

Your backend will run on [http://localhost:5000](http://localhost:5000)

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Your frontend will run on [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

| Layer        | Platform                                                      | Notes                  |
| ------------ | ------------------------------------------------------------- | ---------------------- |
| **Frontend** | [Vercel](https://vercel.com)| Deploy built React app |
| **Backend**  | [Render](https://render.com)| Runs Express server    |
| **Database** | [MongoDB Atlas](https://mongodb.com/atlas)                    | Cloud-hosted DB        |
| **Storage**  | [AWS S3](https://aws.amazon.com/s3/)                          | File storage           |

---

## 📸 Preview (UI Overview)

| Section            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| 🧭 **Navbar**      | Shows app logo + user info (login/logout)            |
| 📂 **Sidebar**     | Projects, folders, and files with add/delete options |
| 💻 **Editor**      | Sandpack-powered live React editor with preview      |
| ☁️ **Save Button** | Syncs code to S3 + MongoDB                           |

---

## 🧩 Future Enhancements

* 📱 PWA support (offline IDE)
* 🧠 Syntax linting & IntelliSense
* 🔄 GitHub integration (push/pull code)
* 🧰 Run backend code (Node/C++ support)

---

## 🧑‍💻 Author

**Siddharth**
📍 Full Stack Developer (React | Node | MongoDB)
🌐 GitHub: [github.com/yourusername](https://github.com/siddharth-gh)

---