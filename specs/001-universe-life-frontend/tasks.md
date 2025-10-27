---
description: "Task list template for feature implementation"
---

# Tasks: 万象生活用户端前端界面设计

**Input**: Design documents from `/specs/001-universe-life-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize TypeScript + React project with Vite dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript strict mode
- [ ] T004 [P] Setup testing framework (Vitest + React Testing Library)
- [ ] T005 [P] Configure bundle analyzer and performance monitoring
- [ ] T006 [P] Setup accessibility testing tools
- [ ] T007 [P] Configure CI/CD pipeline with quality gates

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup design system component library and theme configuration
- [ ] T009 [P] Implement state management (Redux Toolkit + custom hooks)
- [ ] T010 [P] Setup API service layer with error handling and caching
- [ ] T011 Create base React components and hooks that all stories depend on
- [ ] T012 Configure global error boundaries and logging infrastructure
- [ ] T013 Setup responsive design breakpoints and accessibility utilities
- [ ] T014 Configure performance monitoring (Web Vitals tracking)
- [ ] T015 Setup security headers and CSP configuration

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 用户注册和身份认证 (Priority: P1) 🎯 MVP

**Goal**: 实现用户注册、登录和身份验证功能，建立完整的用户档案

**Independent Test**: 新用户可以完成从手机号验证到个人信息设置的完整注册流程，并成功登录查看个人资料页面

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

**NOTE**: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US1] Contract test for auth endpoints in tests/contract/test_auth.py
- [ ] T017 [P] [US1] Integration test for registration flow in tests/integration/test_registration.py

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create User type definitions in src/types/user.ts
- [ ] T019 [P] [US1] Create auth API service in src/services/authService.ts
- [ ] T020 [US1] Create auth Redux slice in src/store/authSlice.ts
- [ ] T021 [US1] Implement login page component in src/pages/auth/LoginPage.tsx
- [ ] T022 [US1] Implement register page component in src/pages/auth/RegisterPage.tsx
- [ ] T023 [US1] Create phone verification component in src/components/auth/PhoneVerification.tsx
- [ ] T024 [US1] Implement user profile form component in src/components/user/ProfileForm.tsx
- [ ] T025 [US1] Create payment account management component in src/components/payment/PaymentAccountForm.tsx
- [ ] T026 [US1] Setup protected route wrapper in src/components/auth/ProtectedRoute.tsx
- [ ] T027 [US1] Implement auth middleware in src/middleware/authMiddleware.ts
- [ ] T028 [US1] Create user dashboard layout in src/components/layout/UserLayout.tsx
- [ ] T029 [US1] Add form validation utilities in src/utils/validation.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 任务浏览和接单 (Priority: P1)

**Goal**: 实现任务列表浏览、搜索筛选和接单功能

**Independent Test**: 用户可以搜索找到特定任务，查看任务详情，并完成接单操作，整个过程无需其他功能依赖

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T030 [P] [US2] Contract test for task endpoints in tests/contract/test_tasks.py
- [ ] T031 [P] [US2] Integration test for task search and filtering in tests/integration/test_task_search.py

### Implementation for User Story 2

- [ ] T032 [P] [US2] Create Task type definitions in src/types/task.ts
- [ ] T033 [P] [US2] Create task API service in src/services/taskService.ts
- [ ] T034 [P] [US2] Create tasks Redux slice in src/store/tasksSlice.ts
- [ ] T035 [US2] Implement task list component in src/components/tasks/TaskList.tsx
- [ ] T036 [US2] Create task card component in src/components/tasks/TaskCard.tsx
- [ ] T037 [US2] Implement task search component in src/components/tasks/TaskSearch.tsx
- [ ] T038 [US2] Create task filter component in src/components/tasks/TaskFilter.tsx
- [ ] T039 [US2] Implement task detail page in src/pages/tasks/TaskDetailPage.tsx
- [ ] T040 [US2] Create task acceptance component in src/components/tasks/TaskAcceptModal.tsx
- [ ] T041 [US2] Implement task search by ID component in src/components/tasks/TaskSearchById.tsx
- [ ] T042 [US2] Create task category selector in src/components/tasks/TaskCategorySelector.tsx
- [ ] T043 [US2] Add task status indicators in src/components/tasks/TaskStatusBadge.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 任务执行和交付 (Priority: P1)

**Goal**: 实现已接任务管理、文件上传和任务交付功能

**Independent Test**: 用户可以查看自己的任务列表，选择特定任务，查看详情并上传完成文件，整个流程可以独立测试

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T044 [P] [US3] Contract test for task submission endpoints in tests/contract/test_submission.py
- [ ] T045 [P] [US3] Integration test for file upload and submission in tests/integration/test_task_submission.py

### Implementation for User Story 3

- [ ] T046 [P] [US3] Create UserTask type definitions in src/types/userTask.ts
- [ ] T047 [P] [US3] Create file upload service in src/services/uploadService.ts
- [ ] T048 [P] [US3] Create user tasks Redux slice in src/store/userTasksSlice.ts
- [ ] T049 [US3] Implement my tasks page in src/pages/tasks/MyTasksPage.tsx
- [ ] T050 [US3] Create task workspace component in src/components/tasks/TaskWorkspace.tsx
- [ ] T051 [US3] Implement file upload component in src/components/upload/FileUpload.tsx
- [ ] T052 [US3] Create task submission form in src/components/tasks/TaskSubmissionForm.tsx
- [ ] T053 [US3] Implement task progress tracker in src/components/tasks/TaskProgressTracker.tsx
- [ ] T054 [US3] Create file preview component in src/components/upload/FilePreview.tsx
- [ ] T055 [US3] Add task deadline reminder in src/components/tasks/TaskDeadlineReminder.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - 佣金收取和支付管理 (Priority: P1)

**Goal**: 实现收益统计展示、支付账户管理和佣金收取功能

**Independent Test**: 用户可以查看收益报表，管理多个支付账户，并在确认任务完成后发起提现操作

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T056 [P] [US4] Contract test for payment endpoints in tests/contract/test_payments.py
- [ ] T057 [P] [US4] Integration test for withdrawal process in tests/integration/test_withdrawal.py

### Implementation for User Story 4

- [ ] T058 [P] [US4] Create Payment type definitions in src/types/payment.ts
- [ ] T059 [P] [US4] Create payment API service in src/services/paymentService.ts
- [ ] T060 [P] [US4] Create payments Redux slice in src/store/paymentsSlice.ts
- [ ] T061 [US4] Implement earnings dashboard page in src/pages/dashboard/EarningsPage.tsx
- [ ] T062 [US4] Create earnings chart components in src/components/charts/EarningsChart.tsx
- [ ] T063 [US4] Implement payment account list in src/components/payment/PaymentAccountList.tsx
- [ ] T064 [US4] Create withdrawal form component in src/components/payment/WithdrawalForm.tsx
- [ ] T065 [US4] Implement transaction history page in src/pages/payment/TransactionHistoryPage.tsx
- [ ] T066 [US4] Create earnings statistics components in src/components/stats/EarningsStats.tsx
- [ ] T067 [US4] Add payment status indicators in src/components/payment/PaymentStatusBadge.tsx

---

## Phase 7: User Story 5 - 实时聊天和沟通 (Priority: P2)

**Goal**: 实现用户间实时聊天功能，包括消息发送、接收和历史记录管理

**Independent Test**: 用户可以发起聊天，发送消息，查看聊天历史，并管理消息，不依赖其他功能模块

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T068 [P] [US5] Contract test for chat endpoints in tests/contract/test_chat.py
- [ ] T069 [P] [US5] Integration test for real-time messaging in tests/integration/test_realtime_chat.py

### Implementation for User Story 5

- [ ] T070 [P] [US5] Create Message and Conversation type definitions in src/types/chat.ts
- [ ] T071 [P] [US5] Create Socket.IO client service in src/services/socketService.ts
- [ ] T072 [P] [US5] Create chat Redux slice in src/store/chatSlice.ts
- [ ] T073 [P] [US5] Implement conversation list page in src/pages/chat/ConversationListPage.tsx
- [ ] T074 [P] [US5] Create chat window component in src/components/chat/ChatWindow.tsx
- [ ] T075 [P] [US5] Implement message list component in src/components/chat/MessageList.tsx
- [ ] T076 [P] [US5] Create message input component in src/components/chat/MessageInput.tsx
- [ ] T077 [P] [US5] Implement message bubble component in src/components/chat/MessageBubble.tsx
- [ ] T078 [P] [US5] Create typing indicator component in src/components/chat/TypingIndicator.tsx
- [ ] T079 [P] [US5] Add chat offline support with IndexedDB in src/services/offlineChatService.ts

---

## Phase 8: User Story 6 - AI智能客服支持 (Priority: P2)

**Goal**: 实现AI智能客服功能，能够基于订单号和自然语言提供解答

**Independent Test**: 用户可以通过输入问题或订单号获得AI客服的自动回复，验证智能客服的解答能力

### Implementation for User Story 6

- [ ] T080 [P] [US6] Create AI客服 type definitions in src/types/aiSupport.ts
- [ ] T081 [P] [US6] Create AI客服 API service in src/services/aiSupportService.ts
- [ ] T082 [P] [US6] Create AI客服 Redux slice in src/store/aiSupportSlice.ts
- [ ] T083 [P] [US6] Implement AI客服聊天界面 in src/pages/support/AiSupportPage.tsx
- [ ] T084 [P] [US6] Create AI客服输入组件 in src/components/support/AiSupportInput.tsx
- [ ] T085 [P] [US6] Implement AI客服消息组件 in src/components/support/AiSupportMessage.tsx
- [ ] T086 [P] [US6] Add转接人工客服功能 in src/components/support/TransferToHuman.tsx

---

## Phase 9: User Story 7 - 平台售后保障 (Priority: P2)

**Goal**: 实现售后申请功能，用户可以提交纠纷并获得平台客服处理

**Independent Test**: 用户可以提交售后申请，查看处理进度，并与客服沟通解决问题

### Implementation for User Story 7

- [ ] T087 [P] [US7] Create AfterSaleRequest type definitions in src/types/afterSale.ts
- [ ] T088 [P] [US7] Create after-sale API service in src/services/afterSaleService.ts
- [ ] T089 [P] [US7] Create after-sale Redux slice in src/store/afterSaleSlice.ts
- [ ] T090 [P] [US7] Implement售后申请页面 in src/pages/support/AfterSalePage.tsx
- [ ] T091 [P] [US7] Create售后申请表单 in src/components/support/AfterSaleForm.tsx
- [ ] T092 [P] [US7] Implement证据上传组件 in src/components/support/EvidenceUpload.tsx
- [ ] T093 [P] [US7] Create售后申请列表在 src/components/support/AfterSaleList.tsx
- [ ] T094 [P] [US7] Add售后状态跟踪在 src/components/support/AfterSaleStatusTracker.tsx

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T095 [P] Documentation updates in docs/
- [ ] T096 Code cleanup and refactoring
- [ ] T097 Performance optimization across all stories
- [ ] T098 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T099 Security hardening
- [ ] T100 Run quickstart.md validation
- [ ] T101 Implement notification system across all features
- [ ] T102 Add comprehensive error handling and user feedback
- [ ] T103 Optimize bundle size and implement code splitting
- [ ] T104 Add internationalization support (i18n)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US3 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Should be independently testable
- **User Story 7 (P2)**: Can start after Foundational (Phase 2) - May integrate with any story but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Type definitions before components
- Services before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Type definitions within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for auth endpoints in tests/contract/test_auth.py"
Task: "Integration test for registration flow in tests/integration/test_registration.py"

# Launch all type definitions for User Story 1 together:
Task: "Create User type definitions in src/types/user.ts"
Task: "Create auth API service in src/services/authService.ts"
Task: "Create auth Redux slice in src/store/authSlice.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Stories 5-7 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + 5
   - Developer B: User Story 2 + 6
   - Developer C: User Story 3 + 7
   - Developer D: User Story 4 + Cross-cutting concerns
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence