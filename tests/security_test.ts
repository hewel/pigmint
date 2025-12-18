import { assertEquals } from "@std/assert";
import {
  escapeHtml,
  escapeXml,
  validateGitHubRepo,
  validateSlug,
} from "../lib/security.ts";

Deno.test("escapeHtml escapes special characters", () => {
  const input = '<script>alert("XSS")</script>';
  const expected = "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;";
  assertEquals(escapeHtml(input), expected);
});

Deno.test("escapeXml escapes XML characters", () => {
  const input = '<title>Test & "Demo"</title>';
  const expected = "&lt;title&gt;Test &amp; &quot;Demo&quot;&lt;/title&gt;";
  assertEquals(escapeXml(input), expected);
});

Deno.test("validateSlug accepts valid slugs", () => {
  assertEquals(validateSlug("my-post"), true);
  assertEquals(validateSlug("hello-world-123"), true);
});

Deno.test("validateSlug rejects invalid slugs", () => {
  assertEquals(validateSlug("../../etc/passwd"), false);
  assertEquals(validateSlug("my post"), false);
  assertEquals(validateSlug("-invalid"), false);
  assertEquals(validateSlug("invalid-"), false);
});

Deno.test("validateGitHubRepo accepts valid repos", () => {
  assertEquals(validateGitHubRepo("owner/repo"), true);
  assertEquals(validateGitHubRepo("my-org/my-repo"), true);
});

Deno.test("validateGitHubRepo rejects invalid repos", () => {
  assertEquals(validateGitHubRepo("owner"), false);
  assertEquals(validateGitHubRepo("owner/repo/extra"), false);
  assertEquals(validateGitHubRepo("../malicious"), false);
});
