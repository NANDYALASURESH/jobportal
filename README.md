# 💼 JobPortal – Full Stack Job Portal Application

A complete full-stack job portal with **React** frontend and **ASP.NET Core Web API** backend, featuring JWT authentication, role-based access control, and full CRUD operations.

---

## 🏗️ Project Architecture

```
JobPortal/
├── backend/
│   └── JobPortalAPI/
│       ├── Controllers/
│       │   ├── AuthController.cs        # Register, Login, JWT issuance
│       │   ├── JobsController.cs        # Job CRUD (public + admin)
│       │   └── ApplicationsController.cs # Apply, review, status update
│       ├── Models/
│       │   ├── ApplicationUser.cs       # Identity user with FullName
│       │   ├── Job.cs                   # Job listing model
│       │   └── JobApplication.cs        # Application model
│       ├── DTOs/
│       │   └── Dtos.cs                  # All Data Transfer Objects
│       ├── Data/
│       │   └── AppDbContext.cs          # EF Core DbContext + relationships
│       ├── Services/
│       │   └── JwtService.cs            # JWT token generation
│       ├── Program.cs                   # App setup, DI, middleware, seed
│       └── appsettings.json             # Config: DB, JWT settings
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js           # Global auth state (React Context)
        ├── services/
        │   └── api.js                   # Axios instance + all API calls
        ├── components/
        │   └── Common/
        │       ├── Navbar.js            # Navigation with role-aware links
        │       └── ProtectedRoute.js    # Role-based route guard
        ├── pages/
        │   ├── Home.js                  # Landing page with hero + recent jobs
        │   ├── Login.js                 # Login form
        │   ├── Register.js              # Registration form
        │   ├── JobsList.js              # Browse/filter all jobs
        │   ├── JobDetail.js             # Job details + apply form
        │   ├── MyApplications.js        # User's application tracker
        │   └── Admin/
        │       ├── AdminDashboard.js    # Stats + quick actions
        │       ├── AdminJobs.js         # Job management table
        │       ├── JobForm.js           # Create/Edit job form
        │       └── AdminApplications.js # Review all applications
        ├── styles/
        │   └── global.css              # Complete design system
        └── App.js                      # Router + route definitions
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### ▶️ Backend Setup

```bash
cd backend/JobPortalAPI

# Restore packages
dotnet restore

# Apply EF Core migrations (creates SQLite database)
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at:
- **http://localhost:5000**
- **Swagger UI**: http://localhost:5000/swagger

> ✅ **Default admin is auto-seeded on first run:**
> - Email: `admin@jobportal.com`
> - Password: `Admin@123`

---

### ▶️ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The React app runs at: **http://localhost:3000**

---

## 🔐 Authentication Flow

```
User → POST /api/auth/login → JWT Token
Token → localStorage → Axios header (Authorization: Bearer <token>)
Backend → [Authorize] attribute validates token → returns 401 if invalid
Frontend → interceptor catches 401 → clears storage → redirects to /login
```

**JWT Payload contains:**
- `NameIdentifier` – User ID
- `Email` – User email
- `Name` – Full name
- `Role` – Admin or User
- `Jti` – Unique token ID
- `exp` – Expiry (8 hours)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register as User |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| POST | `/api/auth/register-admin` | Secret | Register Admin account |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | Public | Get all active jobs (with filters) |
| GET | `/api/jobs/{id}` | Public | Get job by ID |
| GET | `/api/jobs/admin/all` | Admin | Get all jobs including inactive |
| POST | `/api/jobs` | Admin | Create new job |
| PUT | `/api/jobs/{id}` | Admin | Update job |
| DELETE | `/api/jobs/{id}` | Admin | Delete job |

### Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/applications/job/{jobId}` | User | Apply to a job |
| GET | `/api/applications/my` | User | Get my applications |
| GET | `/api/applications/job/{jobId}` | Admin | Get applications for a job |
| GET | `/api/applications/admin/all` | Admin | Get all applications |
| PUT | `/api/applications/{id}/status` | Admin | Update application status |

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|-----------|---------|
| ASP.NET Core 8 | Web API framework |
| C# | Backend language |
| Entity Framework Core | ORM (Code-First) |
| SQLite | Database |
| ASP.NET Core Identity | User management + password hashing |
| JWT Bearer | Token-based authentication |
| Swagger / Swashbuckle | API documentation |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Context API | Global auth state |
| CSS (custom) | Complete design system |

---

## ✨ Features

### User Features
- ✅ Register & Login with JWT
- ✅ Browse all active job listings
- ✅ Filter jobs by title, category, type, location
- ✅ View full job details
- ✅ Apply to jobs with cover letter + optional resume URL
- ✅ Track application status (Pending → Reviewed → Accepted/Rejected)
- ✅ Prevent duplicate applications

### Admin Features
- ✅ Secure admin dashboard with stats
- ✅ Post new jobs with all fields
- ✅ Edit / deactivate / delete jobs
- ✅ View all applications across all jobs
- ✅ Update application status (Pending / Reviewed / Accepted / Rejected)
- ✅ Filter applications by status or search

### Security Features
- ✅ JWT authentication on all protected endpoints
- ✅ Role-based authorization (Admin/User) enforced server-side
- ✅ Frontend route guards (ProtectedRoute)
- ✅ Axios interceptor auto-handles 401 responses
- ✅ Passwords hashed by ASP.NET Core Identity (bcrypt)
- ✅ CORS configured for React origin

---

## 🗃️ Database Schema

```
AspNetUsers (Identity)
  └── Id, Email, UserName, FullName, PasswordHash, ...

Jobs
  ├── Id, Title, Company, Location
  ├── Description, Requirements
  ├── JobType, Category, SalaryRange
  ├── IsActive, PostedAt, Deadline
  └── PostedById (FK → AspNetUsers)

JobApplications
  ├── Id, JobId (FK), ApplicantId (FK)
  ├── CoverLetter, ResumeUrl
  ├── Status (Pending/Reviewed/Accepted/Rejected)
  └── AppliedAt
  [Unique constraint: JobId + ApplicantId]
```

---

## 🔧 Configuration

**Backend** – `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=JobPortal.db"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-32-characters-min",
    "Issuer": "JobPortalAPI",
    "Audience": "JobPortalClient",
    "ExpiresInHours": "8"
  }
}
```

**Frontend** – Create `.env` in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Browse Jobs | `/jobs` | Public |
| Job Detail | `/jobs/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| My Applications | `/my-applications` | User |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Manage Jobs | `/admin/jobs` | Admin |
| Create/Edit Job | `/admin/jobs/create` or `/edit/:id` | Admin |
| All Applications | `/admin/applications` | Admin |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License – free to use for learning and projects.
