# Portfolio API Integration Guide

## Overview

This document provides comprehensive integration documentation for all backend API endpoints and their frontend implementations. The API follows RESTful principles with feature-based organization.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most write operations require JWT authentication via the `Authorization` header:

```
Authorization: Bearer {token}
```

Obtain tokens via the Auth endpoint.

## API Endpoints

### 1. Authentication (AuthController)

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "email": "user@example.com",
  "userId": "user-id-guid"
}
```
- **Frontend Usage**: `Portfolio.UI/src/app/services/auth.service.ts`

---

### 2. Projects (ProjectsController)

#### Get All Projects (Paginated)
- **Endpoint**: `GET /api/projects`
- **Auth**: None
- **Query Parameters**:
  - `page` (int, default: 1)
  - `pageSize` (int, default: 10)
  - `category` (string, optional)
  - `isFeatured` (bool, optional)
  - `search` (string, optional)
  - `sortBy` (string, default: "Order")
  - `sortDirection` (string, default: "asc")
- **Response**: `200 OK`
```json
{
  "items": [...],
  "totalCount": 50,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5
}
```
- **Frontend Usage**: `Portfolio.UI/src/app/services/project.service.ts`

#### Get Featured Projects
- **Endpoint**: `GET /api/projects/featured`
- **Auth**: None
- **Response**: `200 OK` - Array of ProjectDto

#### Get Project by Slug
- **Endpoint**: `GET /api/projects/{slug}`
- **Auth**: None
- **Response**: `200 OK` - ProjectDto

#### Track Project View
- **Endpoint**: `POST /api/projects/{slug}/views`
- **Auth**: None
- **Response**: `200 OK`

#### Get Related Projects
- **Endpoint**: `GET /api/projects/{slug}/related`
- **Auth**: None
- **Response**: `200 OK` - Array of ProjectDto

#### Create Project
- **Endpoint**: `POST /api/projects`
- **Auth**: Required
- **Request Body**: ProjectCreateDto
- **Response**: `201 Created` - ProjectDto

#### Update Project
- **Endpoint**: `PUT /api/projects/{id}`
- **Auth**: Required
- **Request Body**: ProjectUpdateDto
- **Response**: `200 OK` - ProjectDto

#### Delete Project
- **Endpoint**: `DELETE /api/projects/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

#### Project Reactions
- **Add Reaction**: `POST /api/projects/{projectId}/react`
- **Remove Reaction**: `DELETE /api/projects/{projectId}/react/{userId}`
- **Get Reactions**: `GET /api/projects/{projectId}/reactions`

#### Project Comments
- **Add Comment**: `POST /api/projects/{projectId}/comments`
- **Add Reply**: `POST /api/projects/{projectId}/comments/{commentId}/reply`
- **Like Comment**: `POST /api/projects/{projectId}/comments/{commentId}/like`

#### Project Suggestions
- **Tags**: `GET /api/projects/suggestions/tags`
- **Categories**: `GET /api/projects/suggestions/categories`
- **Niches**: `GET /api/projects/suggestions/niches`
- **Companies**: `GET /api/projects/suggestions/companies`

#### Import Project
- **Endpoint**: `POST /api/projects/import-from-url`
- **Auth**: Required
- **Request Body**:
```json
{
  "url": "https://github.com/user/repo"
}
```

---

### 3. Blog (BlogController)

#### Get Blog Posts (Paginated)
- **Endpoint**: `GET /api/blog`
- **Auth**: None
- **Query Parameters**: `page` (default: 1), `pageSize` (default: 10)
- **Response**: `200 OK` - PagedResult<BlogPostDto>

#### Get Blog Post by ID
- **Endpoint**: `GET /api/blog/{id}`
- **Auth**: None
- **Response**: `200 OK` - BlogPostDto

#### Create Blog Post
- **Endpoint**: `POST /api/blog`
- **Auth**: Required
- **Request Body**: BlogPostDto
- **Response**: `201 Created` - BlogPostDto

#### Update Blog Post
- **Endpoint**: `PUT /api/blog/{id}`
- **Auth**: Required
- **Request Body**: BlogPostDto
- **Response**: `200 OK` - BlogPostDto

#### Delete Blog Post
- **Endpoint**: `DELETE /api/blog/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

#### Import Blog Post
- **Endpoint**: `POST /api/blog/import-from-url`
- **Auth**: Required
- **Request Body**:
```json
{
  "url": "https://example.com/blog-post"
}
```

---

### 4. Education (EducationController)

#### Get All Education
- **Endpoint**: `GET /api/education`
- **Auth**: None
- **Response**: `200 OK` - Array of EducationDto

#### Get Education by ID
- **Endpoint**: `GET /api/education/{id}`
- **Auth**: None
- **Response**: `200 OK` - EducationDto

#### Create Education
- **Endpoint**: `POST /api/education`
- **Auth**: Required
- **Request Body**: EducationDto
- **Response**: `201 Created` - EducationDto

#### Update Education
- **Endpoint**: `PUT /api/education/{id}`
- **Auth**: Required
- **Request Body**: EducationDto
- **Response**: `200 OK` - EducationDto

#### Delete Education
- **Endpoint**: `DELETE /api/education/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 5. Skills (SkillsController)

#### Get All Skills
- **Endpoint**: `GET /api/skills`
- **Auth**: None
- **Response**: `200 OK` - Array of SkillDto

#### Get Skill by ID
- **Endpoint**: `GET /api/skills/{id}`
- **Auth**: None
- **Response**: `200 OK` - SkillDto

#### Create Skill
- **Endpoint**: `POST /api/skills`
- **Auth**: Required
- **Request Body**: SkillDto
- **Response**: `201 Created` - SkillDto

#### Update Skill
- **Endpoint**: `PUT /api/skills/{id}`
- **Auth**: Required
- **Request Body**: SkillDto
- **Response**: `200 OK` - SkillDto

#### Delete Skill
- **Endpoint**: `DELETE /api/skills/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 6. Services (ServicesController)

#### Get All Services
- **Endpoint**: `GET /api/services`
- **Auth**: None
- **Caching**: 5 minutes
- **Response**: `200 OK` - Array of ServiceDto

#### Get Service by ID
- **Endpoint**: `GET /api/services/{id}`
- **Auth**: None
- **Response**: `200 OK` - ServiceDto

#### Create Service
- **Endpoint**: `POST /api/services`
- **Auth**: Required
- **Request Body**: ServiceDto
- **Response**: `201 Created` - ServiceDto

#### Update Service
- **Endpoint**: `PUT /api/services/{id}`
- **Auth**: Required
- **Request Body**: ServiceDto
- **Response**: `200 OK` - ServiceDto

#### Delete Service
- **Endpoint**: `DELETE /api/services/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 7. Bio (BioController)

#### Get Bio
- **Endpoint**: `GET /api/bio`
- **Auth**: None
- **Response**: `200 OK` - BioDto

#### Update Bio
- **Endpoint**: `PUT /api/bio/{id}`
- **Auth**: Required
- **Request Body**: BioDto
- **Response**: `200 OK` - BioDto

---

### 8. Experiences (ExperiencesController)

#### Get All Experiences
- **Endpoint**: `GET /api/experiences`
- **Auth**: None
- **Response**: `200 OK` - Array of ExperienceDto

#### Get Experience by ID
- **Endpoint**: `GET /api/experiences/{id}`
- **Auth**: None
- **Response**: `200 OK` - ExperienceDto

#### Create Experience
- **Endpoint**: `POST /api/experiences`
- **Auth**: Required
- **Request Body**: ExperienceDto
- **Response**: `201 Created` - ExperienceDto

#### Update Experience
- **Endpoint**: `PUT /api/experiences/{id}`
- **Auth**: Required
- **Request Body**: ExperienceDto
- **Response**: `200 OK` - ExperienceDto

#### Delete Experience
- **Endpoint**: `DELETE /api/experiences/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 9. Niches (NichesController)

#### Get All Niches
- **Endpoint**: `GET /api/niches`
- **Auth**: None
- **Caching**: 5 minutes
- **Response**: `200 OK` - Array of NicheDto

#### Get Niche by ID
- **Endpoint**: `GET /api/niches/{id}`
- **Auth**: None
- **Response**: `200 OK` - NicheDto

#### Create Niche
- **Endpoint**: `POST /api/niches`
- **Auth**: Required
- **Request Body**: NicheDto
- **Response**: `201 Created` - NicheDto

#### Update Niche
- **Endpoint**: `PUT /api/niches/{id}`
- **Auth**: Required
- **Request Body**: NicheDto
- **Response**: `200 OK` - NicheDto

#### Delete Niche
- **Endpoint**: `DELETE /api/niches/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 10. Categories (CategoriesController)

#### Get All Categories
- **Endpoint**: `GET /api/categories`
- **Auth**: None
- **Caching**: 5 minutes
- **Response**: `200 OK` - Array of CategoryDto

#### Get Category by ID
- **Endpoint**: `GET /api/categories/{id}`
- **Auth**: None
- **Response**: `200 OK` - CategoryDto

#### Create Category
- **Endpoint**: `POST /api/categories`
- **Auth**: Required
- **Request Body**: CategoryDto
- **Response**: `201 Created` - CategoryDto

#### Update Category
- **Endpoint**: `PUT /api/categories/{id}`
- **Auth**: Required
- **Request Body**: CategoryDto
- **Response**: `200 OK` - CategoryDto

#### Delete Category
- **Endpoint**: `DELETE /api/categories/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 11. References (ReferencesController)

#### Get All References
- **Endpoint**: `GET /api/references`
- **Auth**: None
- **Response**: `200 OK` - Array of ReferenceDto

#### Get Reference by ID
- **Endpoint**: `GET /api/references/{id}`
- **Auth**: None
- **Response**: `200 OK` - ReferenceDto

#### Create Reference
- **Endpoint**: `POST /api/references`
- **Auth**: Required
- **Request Body**: ReferenceDto
- **Response**: `201 Created` - ReferenceDto

#### Update Reference
- **Endpoint**: `PUT /api/references/{id}`
- **Auth**: Required
- **Request Body**: ReferenceDto
- **Response**: `200 OK` - ReferenceDto

#### Delete Reference
- **Endpoint**: `DELETE /api/references/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 12. Notifications (NotificationsController)

#### Get Notifications
- **Endpoint**: `GET /api/notifications`
- **Auth**: Required
- **Query Parameters**: `limit` (default: 50), `unreadOnly` (default: false)
- **Response**: `200 OK` - Array of NotificationDto

#### Get Notification Stats
- **Endpoint**: `GET /api/notifications/stats`
- **Auth**: Required
- **Response**: `200 OK` - NotificationStatsDto

#### Mark Notification as Read
- **Endpoint**: `PUT /api/notifications/{id}/mark-read`
- **Auth**: Required
- **Response**: `204 No Content`

#### Mark All as Read
- **Endpoint**: `PUT /api/notifications/mark-all-read`
- **Auth**: Required
- **Response**: `204 No Content`

#### Delete Notification
- **Endpoint**: `DELETE /api/notifications/{id}`
- **Auth**: Required
- **Response**: `204 No Content`

#### Clear All Notifications
- **Endpoint**: `DELETE /api/notifications/clear-all`
- **Auth**: Required
- **Response**: `204 No Content`

---

### 13. Contact (ContactController)

#### Get Contact Messages (Paginated)
- **Endpoint**: `GET /api/contact`
- **Auth**: None
- **Query Parameters**: `page` (default: 1), `pageSize` (default: 20)
- **Response**: `200 OK` - PagedResult<ContactMessageDto>

#### Get Contact Message by ID
- **Endpoint**: `GET /api/contact/{id}`
- **Auth**: None
- **Response**: `200 OK` - ContactMessageDto

#### Create Contact Message
- **Endpoint**: `POST /api/contact`
- **Auth**: None
- **Request Body**: ContactDto
- **Response**: `200 OK`
```json
{
  "message": "Message received successfully.",
  "data": { ... }
}
```

#### Mark Message as Read
- **Endpoint**: `PATCH /api/contact/{id}/read`
- **Auth**: None
- **Response**: `204 No Content`

#### Delete Contact Message
- **Endpoint**: `DELETE /api/contact/{id}`
- **Auth**: None
- **Response**: `204 No Content`

---

### 14. Uploads (UploadsController)

#### Upload Profile Image
- **Endpoint**: `POST /api/uploads/profile-image`
- **Auth**: None
- **Allowed**: .jpg, .jpeg, .png, .webp (max 5MB)
- **Response**: `200 OK`
```json
{
  "url": "/api/uploads/avatars/guid.jpg"
}
```

#### Upload CV
- **Endpoint**: `POST /api/uploads/cv`
- **Auth**: None
- **Allowed**: .pdf, .doc, .docx (max 10MB)
- **Response**: `200 OK` - { url: "..." }

#### Upload Skill Icon
- **Endpoint**: `POST /api/uploads/skill-icon`
- **Auth**: None
- **Allowed**: .png, .jpg, .jpeg, .webp (max 2MB)
- **Response**: `200 OK` - { url: "..." }

#### Upload Project Image
- **Endpoint**: `POST /api/uploads/project-image`
- **Auth**: None
- **Allowed**: .jpg, .jpeg, .png, .webp (max 5MB)
- **Response**: `200 OK` - { url: "..." }

#### Serve File
- **Endpoint**: `GET /api/uploads/{category}/{fileName}`
- **Auth**: None
- **Response**: File with appropriate Content-Type

---

## Frontend Service Integration

### Project Service
**File**: `Portfolio.UI/src/app/services/project.service.ts`

```typescript
// Get all projects
projectService.getProjects(page, pageSize, filters).subscribe(...)

// Get featured projects
projectService.getFeaturedProjects().subscribe(...)

// Get project by slug
projectService.getProjectBySlug(slug).subscribe(...)

// Create project
projectService.createProject(projectData).subscribe(...)

// Update project
projectService.updateProject(id, projectData).subscribe(...)

// Delete project
projectService.deleteProject(id).subscribe(...)
```

### Blog Service
**File**: `Portfolio.UI/src/app/services/blog.service.ts`

```typescript
// Get blog posts
blogService.getPosts(page, pageSize).subscribe(...)

// Get post by ID
blogService.getPostById(id).subscribe(...)

// Create post
blogService.createPost(postData).subscribe(...)

// Update post
blogService.updatePost(id, postData).subscribe(...)

// Delete post
blogService.deletePost(id).subscribe(...)
```

### Education Service
**File**: `Portfolio.UI/src/app/services/education.service.ts`

```typescript
// Get all education
educationService.getEducation().subscribe(...)

// Create education
educationService.createEducation(educationData).subscribe(...)

// Update education
educationService.updateEducation(id, educationData).subscribe(...)

// Delete education
educationService.deleteEducation(id).subscribe(...)
```

### Auth Service
**File**: `Portfolio.UI/src/app/services/auth.service.ts`

```typescript
// Login
authService.login(email, password).subscribe(...)

// Check if logged in
authService.isLoggedIn()

// Get current user
authService.getCurrentUser()

// Logout
authService.logout()
```

---

## Error Handling

All endpoints follow standard HTTP status codes:

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid auth token
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - File validation failed
- `500 Internal Server Error` - Server error

Error responses include a message:
```json
{
  "error": "Description of the error"
}
```

---

## Caching Strategy

- Services list: 5 minutes
- Niches list: 5 minutes
- Categories list: 5 minutes
- Projects: No caching (dynamic)
- Blog posts: No caching (dynamic)

---

## CORS Configuration

CORS is enabled for frontend development. Test endpoint: `GET /api/projects/test-cors`

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production.

---

## Best Practices

1. Always include error handling in subscriptions
2. Use interceptors for auth token injection
3. Implement loading states during API calls
4. Cache frequently accessed data
5. Validate file uploads on both client and server
6. Use pagination for large datasets
7. Implement proper error messages for users
