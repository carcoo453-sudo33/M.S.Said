# Entity Relationship Diagram & Data Schema

This document outlines the core data structures and relational schema of the Portfolio database, managed via Entity Framework Core on SQL Server.

## Primary Entities

### 1. ProjectEntry
The central entity representing a portfolio work item.
* **Id** (PK, Guid)
* **Title / Title_Ar** (String)
* **Slug** (String, Unique Index)
* **Description / Description_Ar** (String)
* **Summary / Summary_Ar** (String)
* **TechStack, Category, Tags, Niche, Company** (Strings)
* **ImageUrl, DemoUrl, RepoUrl** (Strings)
* **Duration, Language, Architecture, Status** (Strings)
* **Order** (Int) - Used for precise UI sorting.
* **IsFeatured** (Bool) - Flags projects for the homepage.
* **Views, ReactionsCount** (Int)
* **GalleryJson** (String) - JSON array of image URLs to avoid a separate table join.
* **ResponsibilitiesJson** (String) - JSON array representing specific roles or tasks undertaken in the project.

### 2. ProjectKeyFeature
Represents a highlighted technical or functional feature of a `ProjectEntry`.
* **Id** (PK, Guid)
* **ProjectId** (FK -> ProjectEntry.Id)
* **Icon** (String)
* **Title / Title_Ar** (String)
* **Description / Description_Ar** (String)

### 3. ProjectChangelogItem
Represents a version release or historical milestone for a `ProjectEntry`.
* **Id** (PK, Guid)
* **ProjectId** (FK -> ProjectEntry.Id)
* **Date** (String)
* **Version** (String)
* **Title / Title_Ar** (String)
* **Description / Description_Ar** (String)

### 4. ProjectComment
Represents a user discussion or comment tied to a specific `ProjectEntry`.
* **Id** (PK, Guid)
* **ProjectId** (FK -> ProjectEntry.Id)
* **AuthorName** (String)
* **AuthorAvatar** (String, Enum mapping)
* **Content** (String)
* **CreatedAt** (DateTime)
* **IsApproved** (Bool) - For moderation purposes.
* **LikesCount** (Int)
* **RepliesJson** (String) - JSON array containing threaded lightweight replies to circumvent complex hierarchical SQL queries.

## Relationships

* **ProjectEntry** has a **One-to-Many** relationship with **ProjectKeyFeature**.
  * A project can have many key features. If a project is deleted, its key features are cascade-deleted.
* **ProjectEntry** has a **One-to-Many** relationship with **ProjectChangelogItem**.
  * A project can have many changelog iterations.
* **ProjectEntry** has a **One-to-Many** relationship with **ProjectComment**.
  * Discussions belong solely to a specific project. 

## JSON Serialization Strategy

To maximize read performance and minimize complex SQL `JOIN` statements for data that is rarely queried independently, the application leverages JSON columns in SQL Server:

1. **`GalleryJson` (ProjectEntry)**: Storing an array of strings is faster than establishing a separate `ProjectImages` table when images are only ever viewed in the context of their parent project.
2. **`ResponsibilitiesJson` (ProjectEntry)**: An array of localized objects `{ text: string, text_Ar: string }`.
3. **`RepliesJson` (ProjectComment)**: Instead of a recursive self-referencing relationship for comment threads (which is slow to query in SQL), direct replies are appended to this JSON array, allowing the UI to render a comment and all its immediate replies in a single database read.

## Auth Schema
Authentication relies on ASP.NET Core Identity. The database contains standard Identity tables (`AspNetUsers`, `AspNetRoles`, `AspNetUserRoles`, etc.) to handle administrator and user logins, securely hashing passwords and managing roles.
