# DataStraw Support CRM

A web-based Customer Support Ticketing CRM built with FastAPI, SQLAlchemy, SQLite, HTML, CSS, and JavaScript.

The system allows customers to create and track support tickets while support agents can manage tickets, update their status and priority, search and filter tickets, and add internal notes.

---

## 📌 Project Overview

DataStraw Support CRM is designed to simplify customer support ticket management.

The application provides two main workflows:

### Customer

- Create a support ticket
- Receive a unique Ticket ID
- Track an existing ticket
- View ticket status
- View ticket information

### Support Agent

- View all support tickets
- Search tickets
- Filter tickets by status
- Filter tickets by priority
- Open ticket details
- Update ticket status
- Update ticket priority
- Add internal notes
- View notes history

---

## 🚀 Features

### Ticket Management

- Create new support tickets
- Automatically generate unique Ticket IDs
- View complete ticket details
- Track tickets using Ticket ID

### Agent Dashboard

- View all tickets
- Search by Ticket ID, customer name, email, subject, or description
- Filter by ticket status
- Filter by priority
- View customer information

### Status Management

Tickets can have one of the following statuses:

- Open
- In Progress
- Closed

### Priority Management

Priority is an internal agent-level field.

New tickets start with:

- Medium priority

Agents can change the priority to:

- Low
- Medium
- High
- Urgent

Customers do not select or manage ticket priority.

### Internal Notes

Agents can:

- Add notes to tickets
- View previous notes
- View note timestamps

### Date and Time

Ticket and note timestamps are stored using India Standard Time (IST).

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### Database

- SQLite
- SQLAlchemy

### Data Validation

- Pydantic

### API

- REST API
- JSON

---

## 📁 Project Structure

```text
DataStraw_Crm_Project/
│
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   │
│   └── routes/
│       ├── __init__.py
│       └── tickets.py
│
├── frontend/
│   ├── index.html
│   ├── customer.html
│   ├── create-ticket.html
│   ├── agent.html
│   ├── ticket.html
│   ├── track-ticket.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── agent.js
│       ├── api.js
│       ├── create-ticket.js
│       ├── customer.js
│       ├── role.js
│       ├── tickets.js
│       └── track-ticket.js
│
├── requirements.txt
├── .gitignore
├── .env.example
└── README.md


## ⚙️ Installation
1. Clone the repository
-git clone <YOUR_GITHUB_REPOSITORY_URL>
2. Enter the project directory
cd DataStraw_Crm_Project
3. Create a virtual environment

Windows:

python -m venv venv
4. Activate the virtual environment

Windows PowerShell:

.\venv\Scripts\activate
5. Install dependencies
pip install -r requirements.txt


▶️ Running the Backend

Start the FastAPI server using:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000

FastAPI Swagger documentation:

http://127.0.0.1:8000/docs

🌐 Running the Frontend

The frontend can be served using a local development server such as VS Code Live Server.

Example:

http://127.0.0.1:5500

The frontend communicates with the FastAPI backend through REST API endpoints.

🔌 API Endpoints
Create Ticket
POST /api/tickets/

Creates a new ticket.

New tickets automatically receive:

Status: Open
Priority: Medium
Get Tickets
GET /api/tickets/

Returns tickets for the agent dashboard.

Optional filters:

?status=Open
?priority=High
?search=TKT-001
Get Customer Ticket
GET /api/tickets/{ticket_id}

Returns customer-safe ticket information.

Priority is intentionally not included in this response.

Get Agent Ticket
GET /api/tickets/agent/{ticket_id}

Returns ticket information for the support agent, including internal priority.

Update Ticket
PUT /api/tickets/{ticket_id}

Agents can update:

Status
Priority
Internal notes

Example:

{
    "status": "In Progress",
    "priority": "High"
}


🔄 Application Workflow
Customer
   │
   │ Create Ticket
   ▼
FastAPI REST API
   │
   ▼
SQLite Database
   │
   ▼
Ticket Created
   │
   │ Ticket ID
   ▼
Customer Confirmation
   │
   ▼
Agent Dashboard
   │
   ├── Search
   ├── Filter
   ├── Status
   ├── Priority
   └── Notes

🗄️ Database

The application uses SQLite with SQLAlchemy ORM.

Main Tables
Tickets

Stores:

Ticket ID
Customer name
Customer email
Subject
Description
Status
Priority
Created timestamp
Updated timestamp
Notes

Stores:

Note ID
Ticket ID
Note text
Created timestamp


🧪 Testing

The following major workflows were tested:

Feature	Result
Create Ticket	Passed
Ticket ID Generation	Passed
Ticket Confirmation	Passed
Customer Tracking	Passed
Agent Dashboard	Passed
Ticket Search	Passed
Status Filtering	Passed
Priority Filtering	Passed
Status Update	Passed
Priority Update	Passed
Add Note	Passed
Notes History	Passed
IST Timestamp	Passed


🔐 Security / Data Handling
Customer priority is not exposed through the customer ticket endpoint.
Agent priority is handled internally.
.env files are excluded from version control.
Local virtual environment files are excluded from GitHub.
SQLite database files are excluded from GitHub.


📈 Future Improvements

Possible future improvements include:

User authentication and authorization
Role-based access control
Email notifications
File attachments
Agent assignment
Ticket categories
Advanced analytics
PostgreSQL database
Production authentication
Automated priority classification

👨‍💻 Project

DataStraw Support CRM

A customer support ticket management system developed using FastAPI and modern web technologies.


## 🌐 Live Deployment

The backend is deployed on Railway.

**Live API:**

https://datastraw-support-crm-production-6bd5.up.railway.app

**API Documentation:**

https://datastraw-support-crm-production-6bd5.up.railway.app/docs

🚀 The FastAPI backend is deployed on Railway and is accessible through the live API URL above.