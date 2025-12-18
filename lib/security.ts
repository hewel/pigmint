// Security utilities for input validation and sanitization

/**
 * Validates a URL slug to prevent path traversal attacks
 */
export function validateSlug(slug: string): boolean {
  // Allow only alphanumeric characters and hyphens
  return /^[a-z0-9-]+$/.test(slug) && !slug.includes("..") &&
    !slug.startsWith("-") && !slug.endsWith("-");
}

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Escapes XML special characters for RSS feeds and sitemaps
 */
export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Validates and sanitizes a GitHub repository path
 */
export function validateGitHubRepo(repo: string): boolean {
  // Format: owner/repo
  const parts = repo.split("/");
  if (parts.length !== 2) return false;

  const [owner, repoName] = parts;

  // GitHub username/owner validation: alphanumeric and hyphens, not start/end with hyphen
  const ownerValid = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(
    owner,
  );

  // Repository name validation: alphanumeric, hyphens, underscores, dots
  const repoValid = /^[a-zA-Z0-9_.-]{1,100}$/.test(repoName) &&
    !repoName.startsWith(".") && !repoName.endsWith(".") &&
    !repoName.endsWith(".git");

  return ownerValid && repoValid;
}

/**
 * Sanitizes content for safe use in meta tags
 */
export function sanitizeMetaContent(content: string): string {
  // Remove any HTML tags and limit length
  const stripped = content.replace(/<[^>]*>/g, "").trim();
  return escapeHtml(stripped.substring(0, 200)); // Limit to 200 characters
}

/**
 * Validates configuration data structure
 */
export function validateConfig(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count < this.maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}
