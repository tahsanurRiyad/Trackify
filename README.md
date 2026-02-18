# Trackify

Trackify is a comprehensive full-stack application designed for efficient employee, asset, and expense management, complete with reporting capabilities. It features a robust ASP.NET Core API backend and a dynamic React frontend, providing a seamless experience for managing organizational resources.

## Features

### Backend (Trackify.Api)
*   **Employee Management:** CRUD operations for employee records, including profile picture and document uploads.
*   **Asset Management:** CRUD operations for tracking company assets, with assignment to employees.
*   **Expense Management:** CRUD operations for recording expenses, including receipt uploads.
*   **User Authentication:** Secure user registration, login, and management with password hashing.
*   **Dashboard Data:** Provides summarized data for employees, assets, expenses, and recent activities.
*   **Reporting:** Generates PDF and web-based reports for employee data using FastReport.
*   **File Storage:** Stores uploaded documents, profile pictures, and receipts in the `wwwroot` directory.
*   **Database:** Utilizes SQL Server with Entity Framework Core for data persistence.
*   **CORS:** Configured to allow cross-origin requests for seamless frontend-backend communication.

### Frontend (trackify-web)
*   **Intuitive Dashboard:** Displays key metrics and recent activities at a glance.
*   **Employee Module:** Interface for adding, viewing, updating, and deleting employee information.
*   **Asset Module:** Interface for managing company assets and their assignments.
*   **Expense Module:** Interface for tracking and managing organizational expenses.
*   **User Authentication:** Login functionality to secure access to the application.
*   **Responsive Design:** Built with Bootstrap for a mobile-first and responsive user experience.
*   **Notifications:** Integrates `react-toastify` for user feedback and alerts.
*   **Charts & Graphs:** Uses `recharts` for visualizing data on the dashboard.

## Technologies Used

### Backend
*   **Framework:** ASP.NET Core 8
*   **Language:** C#
*   **ORM:** Entity Framework Core
*   **Database:** SQL Server
*   **Reporting:** FastReport
*   **Authentication:** Custom (SHA256 hashing)

### Frontend
*   **Framework:** React.js
*   **Language:** JavaScript (ES6+)
*   **Styling:** Bootstrap, Custom CSS
*   **HTTP Client:** Axios
*   **UI Components:** Material UI (dependencies present, usage may vary)
*   **Charting:** Recharts
*   **Alerts:** SweetAlert2, SweetAlert2-React-Content
*   **Notifications:** React Toastify
*   **Icons:** Bootstrap Icons, Lucide React

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   .NET SDK 8.0 or later
*   Node.js (LTS version recommended)
*   npm or Yarn
*   SQL Server (or a compatible database for Entity Framework Core)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/Trackify.git
cd Trackify
```

#### 2. Backend Setup

Navigate to the `Backend/Trackify.Api` directory.

```bash
cd Backend/Trackify.Api
```

**a. Configure Database:**
Update the `DefaultConnection` string in `appsettings.json` and `appsettings.Development.json` to point to your SQL Server instance.

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=your_server_name;Database=TrackifyDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;"
}
```
*Replace `your_server_name` with your actual SQL Server instance name.*

**b. Apply Migrations:**
Open a terminal in the `Backend/Trackify.Api` directory and run the following commands to create the database and apply migrations:

```bash
dotnet ef database update
```

**c. Run the Backend:**

```bash
dotnet run
```
The API will typically run on `https://localhost:7001` (or a similar port).

#### 3. Frontend Setup

Open a new terminal and navigate to the `Frontend/trackify-web` directory.

```bash
cd ../../Frontend/trackify-web
```

**a. Install Dependencies:**

```bash
npm install
# or
yarn install
```

**b. Run the Frontend:**

```bash
npm start
# or
yarn start
```
The frontend application will open in your browser, usually at `http://localhost:3000`.

## Usage

1.  **Login:** Access the application via the frontend URL (`http://localhost:3000`). You will be presented with a login page.
2.  **Register:** If you don't have an account, you can create one via the backend API endpoint `/TrackifyUsers/create` (e.g., using Postman or Swagger UI).
3.  **Navigate:** Use the sidebar to navigate between Dashboard, Employees, Assets, and Expenses sections.
4.  **Manage Data:** Perform CRUD operations on employees, assets, and expenses.
5.  **View Reports:** Access employee reports through the dedicated reporting features.

## API Endpoints (Overview)

The backend API exposes the following main endpoints:

*   `/Assets`: Manage assets.
*   `/Dashboard`: Retrieve dashboard summary and monthly expense data.
*   `/Employees`: Manage employee records, including file uploads.
*   `/Expenses`: Manage expenses, including receipt uploads.
*   `/Reports`: Generate employee reports (PDF, Web, XML).
*   `/TrackifyUsers`: User authentication (create, update, delete, login).
*   `/WeatherForecast`: Default ASP.NET Core weather forecast endpoint.

For detailed API documentation, refer to the Swagger UI available at `/swagger` when the backend is running (e.g., `https://localhost:7001/swagger`).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
