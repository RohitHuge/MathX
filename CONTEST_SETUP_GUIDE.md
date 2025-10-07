# Contest Listing Page Setup Guide

## 🎯 Overview

This guide will help you set up the Contest Listing Page for your MathX platform. The page provides a fully responsive interface for displaying ongoing, upcoming, and past contests with real-time updates from Appwrite.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Appwrite account and project
- React + Vite project setup
- TailwindCSS configured
- Framer Motion installed

## 🚀 Installation Steps

### 1. Install Required Dependencies

```bash
npm install appwrite motion lucide-react
```

### 2. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
```

### 3. Appwrite Database Setup

#### Create Database Collection

1. Go to your Appwrite console
2. Navigate to Databases
3. Create a new collection called `contest_info`
4. Add the following attributes:

| Attribute Name | Type | Size | Required | Default |
|----------------|------|------|----------|---------|
| title | String | 255 | Yes | - |
| description | String | 1000 | Yes | - |
| startTime | DateTime | - | Yes | - |
| eventDuration | Integer | - | Yes | 60 |
| contestDuration | Integer | - | No | 30 |
| status | Enum | - | Yes | draft |
| difficulty | Enum | - | Yes | medium |
| topics | String | 500 | No | - |
| price | Float | - | No | 0 |
| participantCount | Integer | - | No | 0 |

#### Collection Permissions

Set the following permissions for your `contest_info` collection:

- **Read**: `any` (for public access)
- **Create**: `users` (for authenticated users)
- **Update**: `users` (for authenticated users)
- **Delete**: `users` (for authenticated users)

#### Enum Values

**Status Enum:**
- draft
- active
- inactive
- test
- deleted

**Difficulty Enum:**
- easy
- medium
- hard

### 4. Update Configuration

Update your `config.js` file to include the database ID:

```javascript
export const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const appwriteDatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const appwriteFormId = import.meta.env.VITE_APPWRITE_FORM;
export const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const appwriteRegistrationFormId = "registrationform";
```

### 5. Route Configuration

The route `/contests` has been added to your `App.jsx`. You can access the contest listing page at:
- `http://localhost:5173/contests`

## 🎨 Features

### 🏗️ Page Layout
- **Header**: Site logo + user avatar dropdown
- **Tab Navigation**: Ongoing, Upcoming, Past contests
- **Search & Filter**: Real-time search and sorting
- **Responsive Grid**: Contest cards in responsive layout

### 🎴 Contest Cards
Each contest card displays:
- Contest title and description
- Start time (formatted)
- Difficulty level badge
- Participant count
- Status badge (Ongoing/Upcoming/Ended)
- Topics covered
- Action button (Join Contest/View Results)

### 🔄 Data Updates
- Data is fetched once when the page loads
- Users can refresh the page manually to get updated contest information
- Simple and efficient approach without background polling

### 🎭 Animations & Microinteractions
- Framer Motion animations
- Smooth tab switching
- Hover effects on cards
- Loading skeletons
- Empty state animations

### 📱 Responsive Design
- Mobile-first approach
- Stacked cards on mobile
- Responsive grid layout
- Touch-friendly interactions

## 🛠️ Customization

### Color Theme
The page uses the existing MathX color palette:
- Primary: `#A146D4` (Purple)
- Secondary: `#49E3FF` (Cyan)
- Background: `#191D2A` (Dark)
- Text: `#FFFFFF` (White)
- Muted: `#AEAEAE` (Gray)

### Contest Classification Logic
Contests are automatically classified based on current time:
- **Ongoing**: Current time between `startTime` and `startTime + eventDuration`
- **Upcoming**: Current time < `startTime`
- **Past**: Current time > `startTime + eventDuration`

### Adding Sample Data

To test the page, add sample contests to your Appwrite database in the `contest_info` collection:

```javascript
// Sample contest document for contest_info collection
{
  "title": "Weekly Math Challenge",
  "description": "Test your mathematical skills with our weekly challenge featuring algebra, geometry, and calculus problems.",
  "startTime": "2024-01-15T10:00:00.000Z",
  "eventDuration": 120,
  "contestDuration": 30,
  "status": "active",
  "difficulty": "medium",
  "topics": "Algebra,Geometry,Calculus",
  "price": 0,
  "participantCount": 156
}
```

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to fetch contests" error**
   - Check your Appwrite endpoint and project ID
   - Verify database and collection IDs
   - Ensure collection permissions are set correctly

2. **Data not updating**
   - The page fetches data once on load
   - Users need to refresh the page manually to see updated contest information
   - Check browser console for any API call errors

3. **Styling issues**
   - Ensure TailwindCSS is properly configured
   - Check if all required CSS classes are available

4. **Authentication issues**
   - Verify AuthContext is properly configured
   - Check if user authentication is working

### Debug Mode

Enable debug logging by adding this to your component:

```javascript
// Add this to ContestListPage.jsx for debugging
useEffect(() => {
  console.log('Contests:', contests);
  console.log('Filtered contests:', filteredContests);
  console.log('Active tab:', activeTab);
}, [contests, filteredContests, activeTab]);
```

## 📚 API Reference

### Contest Object Structure
```typescript
interface Contest {
  $id: string;
  title: string;
  description: string;
  startTime: string; // ISO date string
  eventDuration: number; // minutes
  contestDuration?: number; // minutes
  status: 'draft' | 'active' | 'inactive' | 'test' | 'deleted';
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string; // comma-separated
  price: number;
  participantCount: number;
  $createdAt: string;
  $updatedAt: string;
  classification?: 'ongoing' | 'upcoming' | 'past'; // computed
}
```

### Utility Functions
The `src/utils/contestUtils.js` file provides helper functions:
- `classifyContest()` - Classify contest status
- `formatDateTime()` - Format dates for display
- `getDifficultyStyling()` - Get difficulty badge styles
- `validateContest()` - Validate contest data
- `sortContests()` - Sort contests by criteria
- `filterContests()` - Filter contests by search query

## 🚀 Deployment

### Production Environment Variables
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_production_project_id
VITE_APPWRITE_DATABASE_ID=your_production_database_id
```

### Build and Deploy
```bash
npm run build
npm run preview
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Appwrite configuration
3. Ensure all dependencies are installed
4. Check the network tab for API call failures

## 🔄 Future Enhancements

Potential improvements for the contest listing page:
- Contest filtering by difficulty, topics, or date range
- Pagination for large contest lists
- Contest creation and editing interface
- Advanced search with filters
- Contest analytics and insights
- Social features (sharing, favorites)
- Contest notifications and reminders

---

**Note**: Make sure to replace all placeholder values (like `your_project_id_here`) with your actual Appwrite project details before deploying to production.
