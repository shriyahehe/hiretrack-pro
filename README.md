# HireTrack Pro

HireTrack Pro is a full-stack Applicant Tracking System designed to help recruiters manage candidates, job openings, interviews, and hiring activity from a centralized dashboard.

The platform provides a modern recruitment workflow with authentication, candidate management, job tracking, interview scheduling, analytics, search, and notifications.

## Live Demo

Live Application: https://hiretrack-pro-ten.vercel.app/

## Features

- User registration and login
- Supabase authentication
- Protected dashboard routes
- Candidate management
- Add, edit, and delete candidates
- Candidate detail pages
- Candidate search by name, position, or email
- Job management
- Add, edit, and delete job openings
- Job detail pages
- Interview scheduling
- Edit and delete interviews
- Upcoming interview notifications
- Live recruitment dashboard
- Real-time database statistics
- Hiring analytics
- User profile
- Account settings
- Secure logout
- Responsive dark-themed user interface

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Prisma

### Deployment

- Vercel
- GitHub

## Application Modules

### Dashboard

The dashboard provides an overview of recruitment activity including:

- Total candidates
- Total interviews
- Open job positions
- Successfully hired candidates
- Recent candidates
- Hiring analytics
- Upcoming interviews

All dashboard values are retrieved from the Supabase database.

### Candidate Management

Recruiters can:

- Add new candidates
- View candidate details
- Edit candidate information
- Delete candidates
- Assign candidates to job openings
- Track candidate hiring status
- Search candidates

### Job Management

The job management module allows recruiters to:

- Create job openings
- View available jobs
- Edit job information
- Delete job openings
- Track active job positions

### Interview Management

Recruiters can:

- Schedule candidate interviews
- Select interview date and time
- Choose interview type
- Update interview status
- Add interview notes
- Edit interviews
- Delete interviews

Upcoming interviews are also displayed through the notification system.

### Analytics

The analytics dashboard displays recruitment statistics including:

- Total candidates
- Total jobs
- Total interviews
- Successful hires
- Hiring rate
- Interview activity
- Candidates per job
- Interviews per candidate

### Search

The global candidate search allows recruiters to search candidates using:

- Candidate name
- Position
- Email address

Selecting a search result opens the candidate detail page.

### Authentication and Security

HireTrack Pro uses Supabase Authentication.

Dashboard routes are protected using server-side authentication checks. Unauthenticated users attempting to access protected routes are automatically redirected to the login page.

## Project Structure

```text
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── (dashboard)/
│   ├── analytics/
│   ├── candidates/
│   ├── dashboard/
│   ├── interviews/
│   ├── jobs/
│   ├── profile/
│   └── settings/
│
components/
├── candidates/
├── dashboard/
├── interviews/
├── jobs/
├── layout/
└── ui/
│
lib/
└── supabase/
