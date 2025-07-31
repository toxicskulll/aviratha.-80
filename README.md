# Hydroponics AI Assistant Dashboard

A production-ready, modern dashboard for monitoring and controlling smart hydroponic systems. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Monitoring**: Live sensor data display with WebSocket support
- **Smart Alerts**: Configurable threshold-based alerting system
- **Responsive Design**: Mobile-first UI that works on all devices
- **Dark Mode**: Full dark/light theme support
- **Authentication**: Secure user authentication (mock implementation included)
- **Data Visualization**: Interactive charts and trend analysis
- **PWA Ready**: Service worker support for offline functionality

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Authentication**: Mock auth (Firebase-ready structure)
- **Real-time**: WebSocket with auto-reconnection
- **State Management**: React Context + hooks

## Getting Started

1. **Clone and install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Update the environment variables with your actual values.

3. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

For the mock authentication:
- Email: `demo@hydroponics.com`
- Password: `password123`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Authentication pages
│   ├── settings/         # Settings page
│   └── alerts/           # Alerts management
├── components/            # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
\`\`\`

## Key Components

### Sensor Monitoring
- Real-time sensor cards with animated value updates
- Color-coded status indicators (normal/warning/critical)
- Configurable alert thresholds

### Data Visualization
- Interactive trend charts with multiple timeframes
- Multi-sensor comparison views
- Historical data analysis

### Alert System
- Real-time threshold monitoring
- Categorized alerts (critical/warning/info)
- Alert management and resolution tracking

### WebSocket Integration
- Auto-reconnecting WebSocket client
- Fallback to mock data when offline
- Structured for MQTT integration

## Customization

### Adding New Sensors
1. Update the sensor configurations in `app/dashboard/page.tsx`
2. Add threshold settings in `contexts/sensor-data-context.tsx`
3. Update the mock data generator if needed

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update CSS variables in `app/globals.css`
- Use the theme provider for dark/light mode

### Authentication
- Replace mock auth in `contexts/auth-context.tsx`
- Implement Firebase Auth or your preferred provider
- Update environment variables accordingly

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
\`\`\`
Deploy to Vercel with automatic CI/CD.

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WS_URL` | WebSocket endpoint URL | No |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase configuration | No |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
