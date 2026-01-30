# Frontend Architecture - Email Agent

## Design Overview

### User Experience Flow

```
1. Landing Page (First Launch)
   ↓
2. Configuration Setup
   - Email tone preference (formal, casual, friendly, professional)
   - Language selection (English/Spanish)
   - Notification preferences
   - Theme preference (light/dark)
   ↓
3. Main App (Background Monitor)
   - Runs in system tray
   - Monitors inbox every X seconds
   ↓
4. New Email Notification (Bottom-left corner)
   - Shows email summary (from AI)
   - Options: "Prepare Response" or "Dismiss"
   - Marks email as read
   ↓
5. Response Generation
   - Uses configured tone
   - Shows generated draft
   - Options: "Send", "Edit", "Cancel"
   ↓
6. Edit Mode (if selected)
   - Chat interface in same popup
   - User gives instructions to agent
   - Agent refines response
   - Loop until user is satisfied
   ↓
7. Send or Discard
```

## Component Architecture

```
src/renderer/
├── App.tsx                          # Main app router
├── components/
│   ├── Landing/
│   │   ├── LandingPage.tsx         # Welcome screen with CTA
│   │   └── ConfigurationWizard.tsx # Multi-step setup wizard
│   │
│   ├── Notification/
│   │   ├── EmailNotification.tsx   # Bottom-left popup
│   │   ├── EmailSummary.tsx        # AI summary display
│   │   └── NotificationManager.tsx # Manages notification queue
│   │
│   ├── Response/
│   │   ├── ResponseViewer.tsx      # Shows generated draft
│   │   ├── ResponseEditor.tsx      # Chat interface for editing
│   │   └── ActionButtons.tsx       # Send/Edit/Cancel buttons
│   │
│   ├── Settings/
│   │   ├── SettingsPanel.tsx       # App settings
│   │   ├── ThemeToggle.tsx         # Light/Dark switcher
│   │   └── LanguageSelector.tsx    # EN/ES switcher
│   │
│   └── Shared/
│       ├── Button.tsx              # Reusable button component
│       ├── Card.tsx                # Card container
│       ├── ChatMessage.tsx         # Chat message bubble
│       └── LoadingSpinner.tsx      # Loading state
│
├── hooks/
│   ├── useEmailMonitor.ts          # Background email polling
│   ├── useSettings.ts              # Local settings management
│   ├── useTheme.ts                 # Theme management
│   ├── useI18n.ts                  # Internationalization
│   └── useAgent.ts                 # AI agent API calls
│
├── api/
│   ├── client.ts                   # Axios/Fetch wrapper
│   ├── emails.ts                   # Email API calls
│   └── agent.ts                    # Agent API calls
│
├── store/
│   ├── settingsStore.ts            # Zustand store for settings
│   ├── notificationStore.ts        # Notification state
│   └── emailStore.ts               # Email state
│
├── i18n/
│   ├── en.json                     # English translations
│   └── es.json                     # Spanish translations
│
└── styles/
    ├── themes.css                  # Light/Dark theme variables
    └── animations.css              # Animations for popups
```

## Data Storage (Local)

**Electron Store** will be used to persist user settings locally:

```typescript
interface UserSettings {
  // Email preferences
  emailTone: 'formal' | 'casual' | 'friendly' | 'professional'

  // UI preferences
  theme: 'light' | 'dark'
  language: 'en' | 'es'

  // Notification preferences
  notificationsEnabled: boolean
  notificationSound: boolean
  checkInterval: number // seconds

  // App state
  isConfigured: boolean
  firstLaunch: boolean

  // Email account (encrypted)
  emailAddress?: string
  lastSync?: Date
}
```

## State Management

Using **Zustand** for state management:

1. **Settings Store**: User preferences, persisted to Electron Store
2. **Notification Store**: Queue of email notifications
3. **Email Store**: Current email being processed
4. **Agent Store**: Chat history for response refinement

## Internationalization (i18n)

**Languages**: English (en), Spanish (es)

**Translation Keys Structure**:
```json
{
  "landing": {
    "title": "Welcome to Email Agent",
    "subtitle": "Your AI-powered email assistant",
    "cta": "Configure Your Personal Email Assistant"
  },
  "config": {
    "tone": {
      "title": "Email Tone",
      "formal": "Formal",
      "casual": "Casual",
      ...
    }
  },
  "notification": {
    "newEmail": "New email from {{sender}}",
    "prepareResponse": "Prepare Response",
    "dismiss": "Dismiss"
  },
  ...
}
```

## Theme System

**CSS Variables approach** for easy theme switching:

```css
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent: #3b82f6;
  ...
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent: #60a5fa;
  ...
}
```

## Notification System

**Position**: Bottom-left corner (configurable)

**Behavior**:
- Slides in from bottom-left
- Auto-dismisses after 30 seconds (unless interacting)
- Queue system for multiple emails
- Click to expand full summary
- Actions: Prepare Response, Dismiss, Mark as Unread

**Animation**: Smooth slide-in with fade

## Response Flow

1. **Initial Generation**:
   - Show loading spinner
   - Display generated response
   - Preview mode (read-only)

2. **Edit Mode**:
   - Split view: Draft (left) | Chat (right)
   - User types instruction
   - Agent refines response in real-time
   - Show character count
   - Diff highlighting (optional)

3. **Send**:
   - Confirmation dialog
   - Send via API
   - Success/Error feedback
   - Return to monitoring mode

## API Integration

**Backend URL**: `http://localhost:8000/api`

**Endpoints Used**:
- `POST /emails/check` - Check for new emails
- `GET /emails/{id}` - Get email details
- `POST /agent/summarize` - Get AI summary
- `POST /agent/generate-reply` - Generate response
- `POST /agent/chat-refine` - Refine with chat
- `POST /emails/send` - Send email
- `POST /emails/{id}/mark-read` - Mark as read

## Error Handling

- **Network errors**: Retry with exponential backoff
- **API errors**: Show user-friendly error messages
- **Validation errors**: Inline form validation
- **Connection lost**: Show "Offline" banner

## Performance Considerations

- **Lazy loading**: Load components on demand
- **Debounced API calls**: Prevent excessive requests
- **Optimistic UI updates**: Instant feedback
- **Virtual scrolling**: For email lists (future)
- **Memoization**: React.memo for expensive components

## Accessibility

- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: ARIA labels
- **Focus management**: Proper focus trapping in modals
- **Color contrast**: WCAG AA compliance
- **Reduced motion**: Respect prefers-reduced-motion

## Security

- **No sensitive data in logs**: Sanitize logging
- **Encrypted storage**: Use Electron safeStorage for credentials
- **Content Security Policy**: Restrict external resources
- **Input sanitization**: Prevent XSS

## Future Enhancements (Out of Scope for MVP)

- Multiple email accounts
- Email threading view
- Search functionality
- Custom templates
- Email scheduling
- Analytics dashboard
- Voice commands
- Mobile companion app
