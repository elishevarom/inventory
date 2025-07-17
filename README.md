# 🗂️ Inventory Management App

This is a full-stack inventory management application with:

- **Frontend** built in React
- **Backend** deployed to AWS using AWS SAM and services such as Lambda, API Gateway, and DynamoDB

---

## 🔧 Tech Stack

### Frontend
- React
- Vite
- Axios or Fetch API

### Backend
- AWS Lambda (Node.js)
- API Gateway
- DynamoDB
- AWS SAM (for deployment)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/elishevarom/inventory.git
cd Inventoryapp
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend
Ensure you have AWS CLI and AWS SAM CLI installed.

```bash
cd backend
sam build
sam deploy
```
This will deploy your Lambda functions and API Gateway endpoints.

### 4. Connect Frontend to Backend
In your frontend code, set your API base URL to the deployed API Gateway URL from the SAM deploy output.

## Author
Mrs. Rom