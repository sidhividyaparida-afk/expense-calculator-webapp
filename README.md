# 💰 Expense Calculator Web App

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
</p>

## 📌 About The Project

Expense Calculator Web App is a FastAPI-based application that helps users manage and calculate their expenses efficiently.

The application allows users to:

- ➕ Add expenses
- 📋 View all expenses
- ✏️ Update expense details
- ❌ Delete expenses
- 🧮 Calculate total expenses
- 📊 Track spending records

Built with FastAPI, this project demonstrates modern backend development practices including API creation, request validation, and RESTful architecture.

---

## 🚀 Features

✅ Fast and lightweight backend

✅ REST API architecture

✅ Input validation using Pydantic

✅ CRUD Operations

✅ Expense calculation functionality

✅ Interactive API documentation

✅ Easy to extend and maintain

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Programming Language |
| FastAPI | Backend Framework |
| Pydantic | Data Validation |
| Uvicorn | ASGI Server |

---

## 📂 Project Structure

```bash
expense-calculator-webapp/backend
│
├── main.py
├── models/
├── routes/
├── services/
├── requirements.txt
├── .gitignore
└── README.md
expense-calculator-webapp/frontend
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/expense-calculator-webapp.git
```

### 2️⃣ Navigate to Project Directory

```bash
cd expense-calculator-webapp
```

### 3️⃣ Create Virtual Environment

```bash
python -m venv venv
```

### 4️⃣ Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux/Mac

```bash
source venv/bin/activate
```

### 5️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Application

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Server will run at:

```text
http://127.0.0.1:8000
```

---

## 📖 API Documentation

FastAPI automatically generates API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

---

## 🧪 Example Request

### Add Expense

```http
POST /expenses
```

```json
{
    "title": "Groceries",
    "amount": 1500,
    "category": "Food"
}
```

### Response

```json
{
    "message": "Expense added successfully"
}
```

---

## 🎯 Learning Outcomes

This project helped me learn:

- FastAPI Fundamentals
- REST API Development
- CRUD Operations
- Request & Response Models
- API Documentation
- Backend Project Structure
- Python Web Development

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the project and submit a pull request.

---

## 🌟 Future Improvements

- User Authentication
- Database Integration
- Expense Categories
- Monthly Reports
- Expense Analytics Dashboard
- Export Reports (PDF/Excel)

---

## 👨‍💻 Author

**Vidya Parida**

1st Year B.Tech Student | Learning Backend Development with FastAPI 🚀

---

## ⭐ Support

If you found this project useful, consider giving it a **Star ⭐** on GitHub!

It motivates me to build more projects and continue learning.