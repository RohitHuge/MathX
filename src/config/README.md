# Dynamic Event Configuration System

This system allows you to easily manage events for the Links page countdown section without modifying code every time you start a new event.

## How to Use

### 1. Edit Event Configuration

Modify the `eventConfig.json` file to update event details:

```json
{
  "currentEvent": {
    "id": "your-event-id",
    "title": "Your Event Title",
    "description": "Event description",
    "startTime": "2025-12-25T15:00:00.000Z",
    "endTime": "2025-12-25T18:00:00.000Z",
    "duration": "3 hours",
    "location": "Online Event",
    "isActive": true,
    "theme": {
      "backgroundColor": "rgba(161, 70, 212, 0.65)"
    },
    "links": [
      {
        "type": "registration",
        "title": "Register Now",
        "description": "Secure your spot",
        "url": "/registration",
        "color": "from-purple-500 to-indigo-500",
        "isRegistration": true
      }
    ]
  }
}
```

### 2. Event Properties

#### Required Properties
- `id`: Unique identifier for the event
- `title`: Event title displayed in the countdown banner
- `description`: Event description
- `startTime`: Event start time in ISO 8601 format (UTC)
- `endTime`: Event end time in ISO 8601 format (UTC)
- `duration`: Human-readable duration (e.g., "3 hours", "2 days")
- `location`: Event location
- `isActive`: Boolean to activate/deactivate the event

#### Optional Properties
- `theme`: Custom styling options
  - `backgroundColor`: Background color for the countdown banner
  - `primaryColor`: Primary theme color
  - `secondaryColor`: Secondary theme color
- `links`: Array of custom links to display
  - `type`: Link type (registration, whatsapp, instagram, website)
  - `title`: Link title
  - `description`: Link description
  - `url`: Link URL
  - `color`: Tailwind CSS gradient classes
  - `isRegistration`: Boolean for registration links

### 3. Date and Time Format

Use ISO 8601 format for dates:
```json
"startTime": "2025-12-25T15:00:00.000Z"  // December 25, 2025 at 3:00 PM UTC
"endTime": "2025-12-25T18:00:00.000Z"    // December 25, 2025 at 6:00 PM UTC
```

### 4. Link Types

Supported link types:
- `registration`: Registration form (navigates to /registration)
- `whatsapp`: WhatsApp group link
- `instagram`: Instagram profile link
- `website`: General website link

### 5. Timer Behavior

The countdown timer automatically:
- Shows time until event starts (when `isActive: true` and event hasn't started)
- Shows "LIVE NOW" status when event is running
- Shows time until event ends during live events
- Updates every second in real-time
- Handles timezone differences correctly

### 6. Examples

#### Quick Event Setup
```json
{
  "currentEvent": {
    "id": "quick-event",
    "title": "Quick Math Quiz",
    "description": "5-minute math challenge",
    "startTime": "2025-01-15T14:00:00.000Z",
    "endTime": "2025-01-15T14:05:00.000Z",
    "duration": "5 minutes",
    "location": "Online",
    "isActive": true
  }
}
```

#### Event with Custom Theme
```json
{
  "currentEvent": {
    "id": "themed-event",
    "title": "Holiday Math Contest",
    "description": "Festive math problems",
    "startTime": "2025-12-25T10:00:00.000Z",
    "endTime": "2025-12-25T12:00:00.000Z",
    "duration": "2 hours",
    "location": "Online",
    "isActive": true,
    "theme": {
      "backgroundColor": "rgba(255, 107, 107, 0.65)"
    }
  }
}
```

### 7. Testing

To test with a near-future event:
```json
"startTime": "2025-01-15T14:00:00.000Z"  // Set to 5 minutes from now for testing
```

### 8. Fallback Behavior

If no event is configured or `isActive: false`, the page will show:
- "No Active Events" message
- Default links (Registration, WhatsApp, Instagram, Website)

## File Structure

```
src/config/
├── eventConfig.json          # Main event configuration
├── eventConfig.example.json  # Example configuration
└── README.md                 # This documentation
```

## Benefits

✅ **No Code Changes**: Update events by editing JSON only  
✅ **Real-time Updates**: Timer updates automatically  
✅ **Flexible Theming**: Custom colors and styling  
✅ **Dynamic Links**: Custom links per event  
✅ **Timezone Support**: Handles UTC and local timezones  
✅ **Fallback Support**: Graceful handling of missing data  
✅ **Easy Testing**: Quick setup for testing scenarios
