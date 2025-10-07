/**
 * Admin Utility Functions
 * 
 * This file contains utility functions for admin role management
 * and permission checking.
 */

/**
 * Checks if a user has admin privileges
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if user is admin
 */
export const isUserAdmin = (user) => {
  if (!user) return false;
  
  // Check for 'admin' label in user.labels array
  return user.labels && user.labels.includes('admin');
};

/**
 * Checks if a user has specific admin permissions
 * @param {Object} user - User object from AuthContext
 * @param {string} permission - Specific permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasAdminPermission = (user, permission) => {
  if (!isUserAdmin(user)) return false;
  
  // Check for specific permission labels
  return user.labels && (
    user.labels.includes(permission) || 
    user.labels.includes('*') ||
    user.labels.includes('admin')
  );
};

/**
 * Gets user role information
 * @param {Object} user - User object from AuthContext
 * @returns {Object} - Role information
 */
export const getUserRole = (user) => {
  if (!user) return { role: 'guest', isAdmin: false, labels: [] };
  
  const isAdmin = isUserAdmin(user);
  const labels = user.labels || [];
  
  return {
    role: isAdmin ? 'admin' : 'user',
    isAdmin,
    labels,
    canManageContests: isAdmin || hasAdminPermission(user, 'manage_contests'),
    canManageUsers: isAdmin || hasAdminPermission(user, 'manage_users'),
    canViewAnalytics: isAdmin || hasAdminPermission(user, 'view_analytics')
  };
};

/**
 * Admin permission constants
 */
export const ADMIN_PERMISSIONS = {
  MANAGE_CONTESTS: 'manage_contests',
  MANAGE_USERS: 'manage_users',
  MANAGE_QUESTIONS: 'manage_questions',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  ALL: '*'
};

/**
 * Default admin permissions
 */
export const DEFAULT_ADMIN_PERMISSIONS = [
  ADMIN_PERMISSIONS.MANAGE_CONTESTS,
  ADMIN_PERMISSIONS.MANAGE_QUESTIONS,
  ADMIN_PERMISSIONS.VIEW_ANALYTICS
];

/**
 * Checks if user can access admin features
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if user can access admin features
 */
export const canAccessAdmin = (user) => {
  return isUserAdmin(user);
};

/**
 * Gets admin navigation items based on user permissions
 * @param {Object} user - User object from AuthContext
 * @returns {Array} - Array of admin navigation items
 */
export const getAdminNavItems = (user) => {
  if (!canAccessAdmin(user)) return [];
  
  const roleInfo = getUserRole(user);
  const items = [];
  
  // Contest Management (always available for admins)
  items.push({
    id: 'admin-contests',
    label: 'Contest Management',
    path: '/admin',
    icon: 'Shield'
  });
  
  // User Management (if permission exists)
  if (roleInfo.canManageUsers) {
    items.push({
      id: 'admin-users',
      label: 'User Management',
      path: '/admin/users',
      icon: 'Users'
    });
  }
  
  // Analytics (if permission exists)
  if (roleInfo.canViewAnalytics) {
    items.push({
      id: 'admin-analytics',
      label: 'Analytics',
      path: '/admin/analytics',
      icon: 'BarChart3'
    });
  }
  
  return items;
};

/**
 * Validates admin access for a specific route
 * @param {Object} user - User object from AuthContext
 * @param {string} route - Route path
 * @returns {boolean} - True if user can access route
 */
export const validateAdminRoute = (user, route) => {
  if (!canAccessAdmin(user)) return false;
  
  const roleInfo = getUserRole(user);
  
  switch (route) {
    case '/admin':
      return roleInfo.canManageContests;
    case '/admin/users':
      return roleInfo.canManageUsers;
    case '/admin/analytics':
      return roleInfo.canViewAnalytics;
    default:
      return false;
  }
};
