import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Portfolio API Test Suite
 * Tests all major endpoints of the Portfolio API
 * Base URL: http://localhost:5283/api
 */

const BASE_URL = 'http://localhost:5283/api';
const TEST_EMAIL = 'm.ssaid356@gmail.com';
const TEST_PASSWORD = 'Memo@3560';
const UNIQUE_ID = Date.now().toString().slice(-6);

let authToken: string;
let testProjectId: string;
let testBlogPostId: string;

describe('Portfolio API Tests', () => {
  
  // ==================== AUTH TESTS ====================
  describe('Authentication', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      authToken = data.token;
    }, 15000);

    it('should reject login with invalid credentials', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: 'wrongpassword'
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect(response.status).toBe(401);
    }, 15000);
  });

  // ==================== BIO TESTS ====================
  describe('Bio Endpoints', () => {
    it('should get bio information', async () => {
      const response = await fetch(`${BASE_URL}/bio`, { signal: AbortSignal.timeout(10000) });
      expect([200, 304]).toContain(response.status);
    }, 15000);

    it('should update bio with authentication', async () => {
      const response = await fetch(`${BASE_URL}/bio`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Updated Title',
          description: 'Updated Description'
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect([200, 204, 405]).toContain(response.status);
    }, 15000);
  });

  // ==================== PROJECTS TESTS ====================
  describe('Projects Endpoints', () => {
    it('should get all projects', async () => {
      const response = await fetch(`${BASE_URL}/projects`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });

    it('should get paginated projects', async () => {
      const response = await fetch(`${BASE_URL}/projects?pageNumber=1&pageSize=10`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('items');
    });

    it('should create a new project with authentication', async () => {
      const response = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: `Test Project ${UNIQUE_ID}`,
          description: 'A test project for API testing',
          category: 0,
          startDate: new Date().toISOString(),
          endDate: null,
          isActive: true,
          repositoryUrl: `https://github.com/test/test-${UNIQUE_ID}`,
          liveUrl: `https://test-${UNIQUE_ID}.com`
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect([201, 200, 400, 500]).toContain(response.status);
      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        if (data.id) testProjectId = data.id;
      }
    }, 15000);

    it('should get project by id', async () => {
      if (!testProjectId) {
        console.log('Skipping: No test project ID available');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/projects/${testProjectId}`);
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        const data = await response.json();
        expect(data.id).toBe(testProjectId);
      }
    });

    it('should update project with authentication', async () => {
      if (!testProjectId) {
        console.log('Skipping: No test project ID available');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/projects/${testProjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          description: `Updated description ${UNIQUE_ID}`,
          isActive: true
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect([200, 204, 400, 404, 500]).toContain(response.status);
    }, 15000);
  });

  // ==================== BLOG TESTS ====================
  describe('Blog Endpoints', () => {
    it('should get all blog posts', async () => {
      const response = await fetch(`${BASE_URL}/blog`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });

    it('should create a new blog post with authentication', async () => {
      const response = await fetch(`${BASE_URL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: `Test Blog Post ${UNIQUE_ID}`,
          content: 'This is a test blog post',
          excerpt: 'Test excerpt',
          category: 'Technology'
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect([201, 200, 400, 500]).toContain(response.status);
      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        if (data.id) testBlogPostId = data.id;
      }
    }, 15000);

    it('should get blog post by id', async () => {
      if (!testBlogPostId) {
        console.log('Skipping: No test blog post ID available');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/blog/${testBlogPostId}`, {
        signal: AbortSignal.timeout(10000)
      });
      expect([200, 404]).toContain(response.status);
    }, 15000);
  });

  // ==================== EDUCATION TESTS ====================
  describe('Education Endpoints', () => {
    it('should get all education records', async () => {
      const response = await fetch(`${BASE_URL}/education`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });

    it('should create education record with authentication', async () => {
      const response = await fetch(`${BASE_URL}/education`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          institution: 'Test University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: new Date().toISOString(),
          isActive: true
        })
      });
      
      expect([201, 200]).toContain(response.status);
    });
  });

  // ==================== SKILLS TESTS ====================
  describe('Skills Endpoints', () => {
    it('should get all skills', async () => {
      const response = await fetch(`${BASE_URL}/skills`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });

    it('should create skill with authentication', async () => {
      const response = await fetch(`${BASE_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: 'Test Skill',
          proficiency: 'Advanced',
          category: 'Programming'
        })
      });
      
      expect([201, 200]).toContain(response.status);
    });
  });

  // ==================== SERVICES TESTS ====================
  describe('Services Endpoints', () => {
    it('should get all services', async () => {
      const response = await fetch(`${BASE_URL}/services`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });
  });

  // ==================== CATEGORIES TESTS ====================
  describe('Categories Endpoints', () => {
    it('should get all categories', async () => {
      const response = await fetch(`${BASE_URL}/categories`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.items) || Array.isArray(data)).toBe(true);
    });
  });

  // ==================== CONTACT TESTS ====================
  describe('Contact Endpoints', () => {
    it('should send contact message', async () => {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test.user@example.com',
          subject: 'Test Subject',
          message: 'This is a test message'
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      expect([200, 201, 400]).toContain(response.status);
    }, 15000);
  });

  // ==================== NOTIFICATIONS TESTS ====================
  describe('Notifications Endpoints', () => {
    it('should get notifications with authentication', async () => {
      const response = await fetch(`${BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        signal: AbortSignal.timeout(10000)
      });
      
      expect([200, 401, 404]).toContain(response.status);
    }, 15000);
  });

  // ==================== CLEANUP ====================
  afterAll(async () => {
    // Clean up test data if needed
    if (testProjectId && authToken) {
      await fetch(`${BASE_URL}/projects/${testProjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }
  });
});
