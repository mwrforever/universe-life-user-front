# Role

你是一个精通 OAuth2 和 OIDC 协议的资深前端工程师，特别擅长处理 **Public Client（公共客户端）** 的安全认证流程。

# Context

正在开发一个纯前端/公共客户端应用（SPA/App）。

- **场景**：SSO 单点登录，登录/注册界面托管在授权服务（Auth Server）后端。
- **限制**：作为一个 Public Client，我**无法**在前端安全存储 `client_secret`。
- **解决方案**：必须强制使用 **OAuth2 Authorization Code Flow with PKCE** (Proof Key for Code Exchange) 模式。
- **技术栈**：[此处填你的技术栈，如 Vue3/React/UniApp] + [此处填请求库，如 Axios/Fetch]。

# Task

请帮我实现以下基于 PKCE 标准的认证模块代码：

## 1. 工具函数：PKCE 生成器 （必须使用市场上使用最多，最新，官方正在维护且稳定版本的第三方包）

需要编写生成 `code_verifier` 和 `code_challenge` 的辅助函数：

- `code_verifier`: 一个随机生成的长字符串（43-128字符）。
- `code_challenge`: 对 verifier 进行 SHA-256 哈希并进行 Base64URL 编码后的结果。
- 如果环境支持，请优先使用 `window.crypto` API。

## 2. 发起登录 (Initiate Login)

编写 `handleLogin` 函数：

- 生成 `code_verifier` 和 `code_challenge`。
- **关键步骤**：将 `code_verifier` 存入 `sessionStorage` 或 `localStorage`（用于后续校验）。
- 拼接授权服务 URL，参数如下：
    - `client_id`: [你的ClientID]
    - `response_type`: 'code'
    - `redirect_uri`: [回调地址]
    - `scope`: 'write'
    - `code_challenge`: [生成的challenge]
    - `code_challenge_method`: 'S256'
- 使用 `window.location.href` 跳转。

## 3. 处理回调 (Handle Callback)

编写处理 `/callback` 的逻辑：

- 解析 URL 中的 `code`。
- 从 Storage 中取出之前存入的 `code_verifier`。
- **直接由前端**发起 POST 请求调用 SSO 的 Token 接口（注意：这里不需要 client_secret）：
    - URL: `[SSO服务地址]/oauth/token`
    - Content-Type: `application/x-www-form-urlencoded`
    - Body 参数:
        - `grant_type`: 'authorization_code'
        - `client_id`: [你的ClientID]
        - `code`: [URL中的code]
        - `redirect_uri`: [必须与发起时一致]
        - `code_verifier`: [取出的verifier]
- 获取 Token 成功后，清除 Storage 中的 verifier，保存 Token 并跳转首页。

# Requirements

- 代码必须严格遵循 PKCE 规范。
- 考虑到兼容性，请确保 Base64URL 编码处理正确（替换 `+` 为 `-`，`/` 为 `_`，去掉 `=`）。
- 代码结构清晰，包含必要的错误捕获。

eyJraWQiOiI2YTFlNjNhNTBjODA0N2YwYTU2OGVhZWY0NGE5Y2E0MSIsI
mFsZyI6IlJTMjU2In0.eyJzdWIiOiJhZG1pbiIsImF1ZCI6ImZDU1lqNVhPaWE2SjRPOXNoZmt
hIiwibmJmIjoxNzY0Mjk4OTU3LCJ1c2VyX2lkIjoxLCJzY29wZSI6WyJ3cml0ZSJdLCJpc3MiOiJodHRwOi8vbG9
jYWxob3N0OjgwOTkiLCJleHAiOjE3NjQzMDYxNTcsImlhdCI6MTc2NDI5ODk1NywianRpIjoiY2M4YjI4NGUtZGE0NC00N
JjLWIzZjctYzljYWI5ZmRkNzEzIn0.W7xLiDg28HWz6m0Wfs3EnNFinqZAYIczryo3SPyWal1l56SW1iFYuI8-UK-88Po-Uu0u3vyPX
ewkdwitdR7MyNdhGgySj7YunUQJA_4-AoFa2D2Eq2O4KYfcV31lCziqGoMXP--KALuFxDZ152VasHP8Qwzkc1Jj9osfjO94THyMO0peT
WjW4Adxnxml1PQLvBhOggkGC6xUthSyXO7bSKKhChMZ94P0oYpV7hLLriHvm6m6eEDsDdcLBFA2vikUZJgH2hx7Ey4eGfUGds
NTyJPjIKpK3OiJCsAGE6G05QRmnMTtsxFq_vPHv2ePtq6qbYlCFjNEm0Is9GbuU8VT8g

eyJraWQiOiI2YTFlNjNhNTBjODA0N2YwYTU2OGVhZWY0NGE5Y2E0MSIsImFs
ZyI6IlJTMjU2In0.eyJzdWIiOiJhZG1pbiIsImF1ZCI6ImZDU1lqNVhPaWE2SjRP
OXNoZmthIiwibmJmIjoxNzY0Mjk4OTU3LCJ1c2VyX2lkIjoxLCJzY29wZSI6WyJ3c
ml0ZSJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwOTkiLCJleHAiOjE3NjQzMDYxNT
csImlhdCI6MTc2NDI5ODk1NywianRpIjoiZGRkNTIwNjUtMzllNS00MzVlLThkY2ItM2NhYjJ
jZjQ0ZTI4In0.j7aiqwTHRBDxPnIYLsXjfmDUQYQD8rnKXKtbf2LYKb9Cy8F77H9areSSjDGQM3_MoUE-
4KAf6shbZKma94wFIKjzsvPH6jJxA9nD6Z4TbyAvHRmrKhCNnl_w7WlRhGwchNiYflO5qRev19q1npAQXAvuSr
WplbQCSD4RNKJSd1U_zE6DEo8Lo0ckGdcroWGzWv2Vl962IRjmmwkHs6DU5sZd4-xPxfB9SNVNH49D93Lt0A-u5SKHg7F9htJF
oJg8Ji6pOQtg9k2rUPgoMjL0TfKa-VJSrwwkpYREG3s13t3R19iCFBEfBwFgEH1y37oXLr08y064mwnoSUVBv5KIGg

eyJraWQiOiI2YTFlNjNhNTBjODA0N2YwYTU2OG
VhZWY0NGE5Y2E0MSIsImFsZyI6IlJTMjU2In0.eyJzdWIi
OiJhZG1pbiIsImF1ZCI6ImZDU1lqNVhPaWE2SjRPOXNoZmthIiwibmJmIjoxNzY0M
jk4OTU3LCJ1c2VyX2lkIjoxLCJzY29wZSI6WyJ3cml0ZSJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3
N0OjgwOTkiLCJleHAiOjE3NjQzMDYxNTcsImlhdCI6MTc2NDI5ODk1NywianRpIjoiZGRkNTIwNjUtMzllNS00Mz
VlLThkY2ItM2NhYjJjZjQ0ZTI4In0.j7aiqwTHRBDxPnIYLsXjfmDUQYQD8rnKXKtbf2LYKb9Cy8F77H9areSSjDGQM3_Mo
UE-4KAf6shbZKma94wFIKjzsvPH6jJxA9nD6Z4TbyAvHRmrKhCNnl_w7WlRhGwchNiYflO5qRev19q1npAQXAvuSrWplbQCSD4R
NKJSd1U_zE6DEo8Lo0ckGdcroWGzWv2Vl962IRjmmwkHs6DU5sZd4-xPxfB9SNVNH49D93Lt0A-u5SKHg7F9htJFoJg8Ji6pOQtg
9k2rUPgoMjclaudeL0TfKa-VJSrwwkpYREG3s13t3R19iCFBEfBwFgEH1y37oXLr08y064mwnoSUVBv5KIGg



Role: You are a Senior Frontend Architect and an Award-Winning UI/UX Designer specializing in modern React applications.
Goal: Build a high-end "Order Taking Platform" (接单网站) that defies the traditional "boring admin panel" look of Ant Design.
Language: The UI content must be in Chinese (Simplified).
1. 🛠 Tech Stack & Core Constraints
   Framework: React 18+ (Vite or Next.js App Router).
   Language: TypeScript (Strict Mode).
   UI Framework: Ant Design (v5+).
   Styling Strategy: CSS Modules or Emotion/Styled-components for custom overrides.
   Critical: You MUST use Ant Design's <ConfigProvider> to customize the global theme (tokens) to break the "default enterprise look."
   Icons: use-lucide or @ant-design/icons (customized size/stroke).
2. 🎨 Design & Aesthetic Guidelines (Non-Negotiable)
   The UI must be stunning, modern, and have high visual impact.
   🚫 Anti-Patterns (DO NOT DO):
   No Cheap Gradients: Do not use harsh, saturated linear gradients (e.g., standard CSS rainbow text). Use subtle mesh gradients or solid, sophisticated colors.
   No "Default AntD" Look: Do not just drop standard blue buttons and grey tables. Modify border radius, box shadows, and font weights.
   No Clutter: Avoid dense information density. Use whitespace effectively.
   ✅ Design Requirements (MUST DO):
   Visual Impact: The Hero section must grab attention immediately (e.g., large typography, 3D-style illustrations, or glassmorphism cards).
   Modern Layouts: Use Bento Grid layouts for categories.
   Micro-Interactions: Add subtle hover effects (transform: scale, shadow bloom) to cards and buttons.
   Color Palette: Use a "Dark Mode" inspired aesthetic or a clean "High-End Light Mode" (e.g., Off-white backgrounds, Deep Indigo/Black primary, vibrant accents like Neon Purple or Coral for tags).
   Coordination: Ensure consistency in border-radius (e.g., all cards rounded-xl) and typography hierarchy.
3. 🗂 Domain Logic: Dynamic Categories
   The platform supports 4 distinct business lines. The UI must adapt to these contexts:
   Gaming & Esports (游戏电竞) -> Vibe: Cyberpunk/Neon.
   Fields: Game (LoL/Genshin), Server, Rank, Account Type.
   Enterprise Projects (项目外包) -> Vibe: Professional/Clean Blue.
   Fields: System Type (ERP/CRM), Tech Stack, Dev Cycle.
   Academic/Campus (校园咨询) -> Vibe: Minimalist/Bookish.
   Fields: Subject, Deadline, "Consulting" Type (Documentation/Tutoring).
   Design & Multimedia (设计多媒体) -> Vibe: Artistic/Colorful.
   Fields: Style, Format, Portfolio Requirement.
4. 🧪 Quality Assurance & Iteration Protocol
   You are not just writing code; you are delivering a product.
   Strict Type Safety: No any types. Define comprehensive Interfaces for Order, User, Category.
   Component Stability: Before finishing a response, mentally "run" the code to ensure hooks rules are not violated and imports are correct.
   Visual Regression Check: Ask yourself: "Does this look like a top-tier SaaS product or a student project?" If it looks cheap, refactor the CSS immediately before outputting.
   Mock Data: Provide realistic, rich mock data (not just "test 1", "test 2") to demonstrate the layout's capabilities.
5. 🚀 Execution Plan (Step-by-Step)
   Step 1: Theme Engine Setup
   Create a theme/themeConfig.ts for Ant Design.
   Increase borderRadius globally.
   Change colorPrimary to something unique (e.g., #6366f1 or #0f172a).
   Set up a sophisticated font stack.
   Step 2: The "High-Impact" Landing Page
   Build a Hero Section with a modern title and a "Post Requirement" wizard entry.
   Build a Category Section using Ant Design Card (heavily styled) or a CSS Grid layout, differentiating the 4 categories visually.
   Step 3: The "Post Order" Wizard
   Use Steps component from Ant Design.
   Implement a dynamic form engine where fields change based on the Category selected (Gaming vs. Enterprise).
   Step 4: The Market List
   Use List or ProList (if available) but styled to look like a Dribbble shot, not an Excel sheet.
   Action:
   Please start by configuring the Ant Design Theme (ConfigProvider) and the TypeScript Interfaces. Then, implement the Landing Page (Home). Ensure the visual result is "Wow" factor worthy.
