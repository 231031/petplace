FROM golang:1.23.1-alpine as base

WORKDIR /app/go

# Install necessary tools
RUN apk update && apk add --no-cache git curl

# Install air using Go
RUN go install github.com/air-verse/air@latest

COPY . .

RUN go mod download

# Create the public/uploads folder
RUN mkdir -p public/uploads

# Build the Go application
# RUN go build -o cmd/main/main ./cmd/*/*.go

# Expose the port the application will run on
EXPOSE 5000

# Run
CMD ["air"]
# CMD ["./cmd/main/main"]