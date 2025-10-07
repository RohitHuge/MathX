# Appwrite Database Setup Guide

## 🗄️ Database Collections Setup

This guide explains how to set up the required Appwrite database collections for the MathX contest platform.

## 📋 Required Collections

### 1. **`contest_info` Collection**

**Purpose**: Store contest information and metadata.

#### **Attributes**:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| `title` | String | 255 | Yes | - | No |
| `description` | String | 2000 | Yes | - | No |
| `startTime` | DateTime | - | Yes | - | No |
| `eventDuration` | Integer | - | Yes | 60 | No |
| `contestDuration` | Integer | - | Yes | 30 | No |
| `status` | Enum | - | Yes | draft | No |
| `difficulty` | Enum | - | Yes | easy | No |
| `topics` | String | 1000 | No | - | Yes |
| `price` | String | 152 | No | "Free" | No |
| `participantCount` | Integer | - | No | 1 | No |
| `questionCount` | Integer | - | No | 1 | No |
| `showInLanding` | Boolean | - | No | false | No |

**Note**: 
- `participantCount` has a range validation of 1-10,000 in Appwrite.
- `questionCount` has a range validation of 1-1,000 in Appwrite.
- `price` field supports flexible text input for monetary values, rewards, trophies, certificates, etc.
- `showInLanding` controls whether the contest appears on the main landing page.

#### **Enum Values**:

**Status Enum**:
- `draft`
- `active`
- `inactive`
- `test`
- `deleted`

**Difficulty Enum**:
- `easy`
- `medium`
- `hard`

#### **Indexes**:
- **Status Index**: `status` (Key: `status`, Type: `key`, Attributes: `["status"]`)
- **Difficulty Index**: `difficulty` (Key: `difficulty`, Type: `key`, Attributes: `["difficulty"]`)
- **Start Time Index**: `startTime` (Key: `startTime`, Type: `key`, Attributes: `["startTime"]`)

---

### 2. **`questions` Collection**

**Purpose**: Store contest questions with multiple choice options.

#### **Attributes**:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| `contest_id` | String | 255 | Yes | - | No |
| `question` | String | 5000 | Yes | - | No |
| `optionA` | String | 1000 | Yes | - | No |
| `optionB` | String | 1000 | No | - | No |
| `optionC` | String | 1000 | No | - | No |
| `optionD` | String | 1000 | No | - | No |
| `answer` | String | 1 | Yes | - | No |
| `marks` | Float | - | No | 1.0 | No |

#### **Indexes**:
- **Contest Index**: `contest_id` (Key: `contest_id`, Type: `key`, Attributes: `["contest_id"]`)
- **Answer Index**: `answer` (Key: `answer`, Type: `key`, Attributes: `["answer"]`)

---

## 🛠️ Setup Instructions

### **Step 1: Create Database**

1. **Go to Appwrite Console**
2. **Navigate to Databases**
3. **Click "Create Database"**
4. **Name**: `MathX Contest Platform`
5. **Database ID**: `mathx_contests` (or your preferred ID)

### **Step 2: Create Collections**

#### **Create `contest_info` Collection**:

1. **Click "Create Collection"**
2. **Collection ID**: `contest_info`
3. **Name**: `Contest Information`
4. **Add Attributes** (as per table above)
5. **Add Enums** (status and difficulty)
6. **Create Indexes** (status, difficulty, startTime)

#### **Create `questions` Collection**:

1. **Click "Create Collection"**
2. **Collection ID**: `questions`
3. **Name**: `Contest Questions`
4. **Add Attributes** (as per table above)
5. **Create Indexes** (contest_id, answer)

### **Step 3: Set Permissions**

#### **For `contest_info` Collection**:

**Read Permissions**:
- `users` (all authenticated users can read)

**Write Permissions**:
- `users` with `admin` label (only admins can write)

**Delete Permissions**:
- `users` with `admin` label (only admins can delete)

#### **For `questions` Collection**:

**Read Permissions**:
- `users` (all authenticated users can read)

**Write Permissions**:
- `users` with `admin` label (only admins can write)

**Delete Permissions**:
- `users` with `admin` label (only admins can delete)

---

## 📝 Sample Data

### **Sample Contest**:

```json
{
  "title": "Weekly Math Challenge",
  "description": "Test your mathematical skills with our weekly challenge featuring algebra, geometry, and calculus problems.",
  "startTime": "2024-01-15T10:00:00.000Z",
  "eventDuration": 120,
  "contestDuration": 30,
  "status": "active",
  "difficulty": "medium",
  "topics": ["Algebra", "Geometry", "Calculus"],
  "price": "Free",
  "participantCount": 156,
  "questionCount": 20,
  "showInLanding": true
}
```

### **Sample Question**:

```json
{
  "contest_id": "contest_document_id",
  "question": "What is the derivative of $f(x) = x^2 + 3x + 2$?",
  "optionA": "$2x + 3$",
  "optionB": "$2x + 2$",
  "optionC": "$x + 3$",
  "optionD": "$2x$",
  "answer": "A",
  "marks": 5.0
}
```

---

## 🔧 Configuration

### **Update `config.js`**:

```javascript
export const appwriteEndpoint = 'https://cloud.appwrite.io/v1';
export const appwriteProjectId = 'your-project-id';
export const appwriteDatabaseId = 'mathx_contests'; // Your database ID
```

### **Environment Variables** (Optional):

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=mathx_contests
```

---

## 🧪 Testing Setup

### **Test Data Creation**:

1. **Create a test contest**:
   - Title: "Test Contest"
   - Status: "draft"
   - Difficulty: "easy"

2. **Create test questions**:
   - Add 2-3 sample questions
   - Test different answer options (A, B, C, D)
   - Test KaTeX rendering

3. **Test permissions**:
   - Login as admin user
   - Create/edit contests and questions
   - Login as regular user
   - Verify read-only access

---

## 🚨 Troubleshooting

### **Common Issues**:

1. **Permission Denied**:
   - Check user labels in Appwrite Console
   - Ensure user has "admin" label for write access
   - Verify collection permissions

2. **Collection Not Found**:
   - Verify collection IDs match exactly
   - Check database ID in config.js
   - Ensure collections are created in correct database

3. **Attribute Errors**:
   - Verify all required attributes are created
   - Check attribute types and sizes
   - Ensure enum values match exactly

4. **Index Errors**:
   - Verify indexes are created correctly
   - Check index attributes match collection attributes
   - Ensure index types are correct

### **Debug Steps**:

1. **Check Appwrite Console**:
   - Verify collections exist
   - Check permissions
   - Review attribute types

2. **Check Browser Console**:
   - Look for Appwrite errors
   - Verify API calls
   - Check network requests

3. **Test with Simple Data**:
   - Create minimal contest
   - Add simple question
   - Test basic CRUD operations

---

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Database Collections](https://appwrite.io/docs/products/databases)
- [Permissions](https://appwrite.io/docs/products/databases/permissions)
- [Indexes](https://appwrite.io/docs/products/databases/indexes)

---

**Note**: Make sure to replace placeholder values with your actual Appwrite project details and adjust collection IDs as needed for your setup.
