# Admin Setup Guide

## 🔐 Admin Role Management

This guide explains how to set up admin users for the MathX contest platform.

## 📋 Admin Requirements

### User Role Structure
Admin users are identified by **labels** in their user profile:

```javascript
// Admin user structure
{
  $id: "user_id",
  name: "Admin Name",
  email: "admin@example.com",
  labels: ["admin"]         // Primary admin indicator
}
```

### Multiple Labels Support
You can also use specific permission labels:

```javascript
// User with specific permissions
{
  $id: "user_id",
  name: "Contest Manager",
  email: "manager@example.com",
  labels: ["admin", "manage_contests", "manage_questions"]
}
```

## 🛠️ Setting Up Admin Users

### Method 1: Appwrite Console (Recommended)

1. **Go to your Appwrite Console**
2. **Navigate to Users section**
3. **Find the user you want to make admin**
4. **Click on the user to edit**
5. **Go to the "Labels" tab**
6. **Add the "admin" label**

**Note**: Labels can only be created and modified from the Appwrite Console or Server SDK, not from the Client SDK.

### Method 2: Server SDK Setup

**Note**: Labels can only be assigned using the Server SDK, not the Client SDK.

```javascript
// Server-side code (Node.js example)
import { Client, Users } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('your-project-id')
    .setKey('your-server-key'); // Server API key

const users = new Users(client);

// Assign admin label to user
const assignAdminLabel = async (userId) => {
  try {
    await users.updateLabels(userId, ['admin']);
    console.log('Admin label assigned successfully');
  } catch (error) {
    console.error('Error assigning admin label:', error);
  }
};
```

### Method 3: Database Direct Update

If you have direct database access:

```sql
-- Update user preferences to make them admin
UPDATE users 
SET prefs = JSON_SET(prefs, '$.role', 'admin', '$.isAdmin', true)
WHERE email = 'admin@example.com';
```

## 🔍 Admin Role Detection

The system checks for admin privileges using Appwrite labels:

### Primary Check:
- `user.labels.includes('admin')`

### Code Implementation:
```javascript
// Check if user is admin
const isUserAdmin = (user) => {
  if (!user) return false;
  return user.labels && user.labels.includes('admin');
};
```

## 🎯 Admin Features

### Navigation Access
- **Admin sidebar item** only visible to admin users
- **Admin route protection** prevents unauthorized access
- **Role-based navigation** shows appropriate options

### Admin Capabilities
- **Contest Management**: Create, edit, delete contests
- **Question Management**: Add, edit, delete questions with KaTeX support
- **User Management**: Manage user roles and permissions (future)
- **Analytics**: View platform statistics (future)

## 🚫 Access Control

### Route Protection
- `/admin` route is protected by `AdminRoute` component
- Non-admin users see "Access Denied" page
- Automatic redirect to dashboard for unauthorized users

### Sidebar Visibility
- Admin navigation item only appears for admin users
- Regular users see standard navigation only
- Dynamic navigation based on user role

## 🧪 Testing Admin Access

### Test Admin User
Create a test admin user and assign the "admin" label:

1. **Create user account** through normal registration
2. **Go to Appwrite Console**
3. **Find the user in Users section**
4. **Add "admin" label to the user**

### Verification Steps
1. **Login as admin user**
2. **Check sidebar** - should see "Admin" option
3. **Navigate to `/admin`** - should access admin panel
4. **Login as regular user**
5. **Check sidebar** - should NOT see "Admin" option
6. **Try to access `/admin`** - should see "Access Denied"

## 🔧 Troubleshooting

### Admin Option Not Showing
1. Check user labels in Appwrite console
2. Verify "admin" label is assigned to the user
3. Clear browser cache and refresh
4. Check browser console for errors

### Access Denied Error
1. Verify user is logged in
2. Check user labels in Appwrite console
3. Ensure "admin" label is properly assigned
4. Try logging out and back in

### Permission Issues
1. Check user labels array
2. Verify label names are correct
3. Ensure labels are properly assigned
4. Check for typos in label names

## 📝 Admin User Examples

### Super Admin
```javascript
{
  labels: ["admin", "*"]  // Admin with all permissions
}
```

### Contest Manager
```javascript
{
  labels: ["admin", "manage_contests", "manage_questions"]
}
```

### Analytics Viewer
```javascript
{
  labels: ["admin", "view_analytics"]
}
```

## 🔄 Role Updates

### Making Existing User Admin
**Note**: Labels can only be updated from Appwrite Console or Server SDK.

1. **Go to Appwrite Console**
2. **Navigate to Users section**
3. **Find the user**
4. **Go to Labels tab**
5. **Add "admin" label**

### Removing Admin Access
1. **Go to Appwrite Console**
2. **Navigate to Users section**
3. **Find the user**
4. **Go to Labels tab**
5. **Remove "admin" label**

## 🛡️ Security Considerations

1. **Limit admin users** to trusted individuals only
2. **Use strong passwords** for admin accounts
3. **Regularly audit** admin access and permissions
4. **Monitor admin actions** for security
5. **Implement 2FA** for admin accounts (future enhancement)

## 📞 Support

If you encounter issues with admin setup:

1. Check the browser console for errors
2. Verify Appwrite user preferences
3. Test with a fresh admin user
4. Contact support with specific error messages

---

**Note**: Admin privileges are determined by user labels in Appwrite. Make sure to assign the "admin" label to users for admin access to work properly.
