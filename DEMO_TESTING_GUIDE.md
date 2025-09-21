# 🚀 SMART CONNECTION - Demo & Testing Guide

## 🎯 Demo Accounts

Test the application with these pre-configured demo accounts:

### 🔐 **Admin Account**
- **Email:** `admin@smartconnection.edu`
- **Password:** Any password
- **Features:** Full user management, admin dashboard, all permissions

### 🎓 **Student Account**
- **Email:** `student@smartconnection.edu`
- **Password:** Any password  
- **Features:** Student dashboard, read-only access, project viewing

### 🏢 **Company Representative**
- **Email:** `company@smartconnection.edu`
- **Password:** Any password
- **Features:** Company dashboard, talent matching, project posting

### 👨‍🏫 **Mentor Account**
- **Email:** `mentor@smartconnection.edu`
- **Password:** Any password
- **Features:** Mentor dashboard, student guidance, project reviews

## 🧪 Testing Features

### 1. **Authentication Testing**
- ✅ Email/Password login with demo accounts
- ✅ Google SSO simulation (click "Continue with Google")
- ✅ Microsoft SSO simulation
- ✅ Westcliff SSO simulation
- ✅ Session persistence and auto-redirect

### 2. **Admin Features Testing (Login as Admin)**
- Navigate to `/admin/dashboard` - View user statistics
- Navigate to `/admin/users` - User management interface
- **Test User CRUD:**
  - ➕ Add new user with different roles
  - ✏️ Edit existing user information
  - 🗑️ Delete users (with confirmation)
  - 🔍 Search and filter users by role
  - 📊 View user statistics and charts

### 3. **Role-Based Access Testing**
- **Student Login:** Should see student-specific navigation and dashboard
- **Company Login:** Should see company-specific features and dashboard
- **Mentor Login:** Should see mentor tools and guidance features
- **Admin Login:** Should see full system access including user management

### 4. **Navigation & UI Testing**
- ✅ Responsive design on different screen sizes
- ✅ Sidebar navigation with role-based menu items
- ✅ User profile dropdown with correct user information
- ✅ Loading states and error handling
- ✅ Toast notifications for user actions

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Git

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd SMART-CAPSTON-PROJECT

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Start both servers
cd ..
npm run dev        # Frontend on http://localhost:3002
cd backend
python simple_main.py  # Backend on http://localhost:8001
```

## 🌐 Application URLs

- **Frontend:** http://localhost:3002
- **Backend API:** http://localhost:8001
- **API Health Check:** http://localhost:8001/health

## 📱 Key Features Demonstrated

### ✅ **Authentication System**
- Multi-provider SSO (Google, Microsoft, Westcliff)
- Role-based authentication
- Session management
- Auto-redirect after login

### ✅ **User Management (Admin Only)**
- Complete CRUD operations for users
- Role assignment and permission management
- User statistics and analytics
- Search and filtering capabilities
- Bulk operations support

### ✅ **Role-Based Interface**
- Dynamic navigation based on user role
- Role-specific dashboards and features
- Protected routes and access control
- Appropriate permission levels

### ✅ **Modern UI/UX**
- Responsive design with Tailwind CSS
- Professional component library (shadcn/ui)
- Loading states and error handling
- Toast notifications
- Dark/light mode support

## 🐛 Testing Checklist

### Authentication Flow
- [ ] Login with admin@smartconnection.edu
- [ ] Login with student@smartconnection.edu  
- [ ] Login with company@smartconnection.edu
- [ ] Test Google SSO button (simulation)
- [ ] Test logout functionality
- [ ] Verify session persistence after page refresh

### Admin User Management
- [ ] Access admin dashboard at /admin/dashboard
- [ ] View user statistics and charts
- [ ] Navigate to user management at /admin/users
- [ ] Add a new user with student role
- [ ] Edit an existing user's information
- [ ] Delete a test user
- [ ] Search users by name/email
- [ ] Filter users by role

### Role-Based Access
- [ ] Login as student - verify limited navigation
- [ ] Login as company - verify company features
- [ ] Login as mentor - verify mentor tools
- [ ] Try accessing /admin/users as non-admin (should be blocked)

### UI/UX Testing
- [ ] Test on mobile device/small screen
- [ ] Verify sidebar collapse/expand
- [ ] Check user profile dropdown
- [ ] Test loading states during login
- [ ] Verify error messages for failed operations

## 🚀 Deployment Ready

The application is configured for deployment with:
- Docker containerization (docker-compose.yml)
- Environment variable configuration
- Production build optimization
- CORS configuration for cross-origin requests
- Health check endpoints

## 📞 Support

For issues or questions during testing:
1. Check browser console for errors
2. Verify both servers are running
3. Check network requests in developer tools
4. Review application logs

---

**Happy Testing! 🎉**

*SMART CONNECTION - Connecting Students, Mentors, and Companies*