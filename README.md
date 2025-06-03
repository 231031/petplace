# Petplace

## About this project
Petplace is a web application that integrates all pet hotels in Thailand into a single platform. It supports both pet owners and pet hotel owners, providing a seamless experience for finding, booking, and managing pet accommodations.

## Key Features
- Role Management: Users can manage multiple roles within their account. While an account can be assigned various roles, only one role can be active at a time.
- Search and Book: Pet owners can search for pet hotels based on location, animal types, and cage size and make bookings.
- Hotel Management: Pet hotel owners can manage their cages in hotels and related bookings.
- Payment: A mock payment system integrated support by https://www.sandbox.paypal.com/th/home
- User Reviews: Customers can share feedback and rate their experiences, helping others make informed decisions.

## Technical
### Backend
- Language: Go (Golang)
- Framework: Echo
- API Architecture: RESTful API - API Documentation ( http://localhost:{port}/swagger/index.html )
- Authentication and Authorization: Implements secure JWT-based authentication and role-based authorization by validating user roles embedded within the token to restrict access to specific resources and actions.

### Frontend
- Language: Typescript
- Library: React
- Styling: TailwindCSS
 
### Database
- Database Management System: MySQL
- ORM: GORM (for backend database management in Go)
