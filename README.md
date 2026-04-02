# HubSpot Integration - Server API

A complete custom **Server API integration system** for HubSpot, including:

* Node.js backend (Express API)
* Custom Bootstrap API Documentation UI
* Live API testing (Swagger-like interface)

---

# Requirements

Make sure you have the following installed:

* Node.js (v16 or higher recommended)
* npm (comes with Node.js)
* Internet connection (for HubSpot API)

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/remanbusiness/hubspot
cd hubspot-node
```

---

## 2. Install Node Dependencies

```bash
npm install
```

---

## 3. Start Node Server

```bash
node server.js
```

Server will run at:

```
https://domain-name.com:3000
```

---

## 5. Open API Docs UI

```
https://domain-name/hubspot/index.html
```

 This will open your **custom Swagger-like interface**

---

# Base URL (Test Server)

```
https://domain-name.com:3000/
```

---

# Server APIs

## Contact APIs

### Get Contact Fields

```
POST https://domain-name.com:3000/get-contact-required-fields
```
#### CURL Example

```bash
curl -X POST https://domain-name.com:3000/get-contact-required-fields \
-H "Content-Type: application/json" \
-d '{
      "access_token": "YOUR_TOKEN"
    }'
```

### ➤ Create Contact

```
POST https://domain-name.com:3000/create-contact
```

#### CURL Example

```bash
curl -X POST https://domain-name.com:3000/create-contact \
-H "Content-Type: application/json" \
-d '{
      "access_token": "YOUR_TOKEN",
      "email": "john@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "phone": "+1234567890"
    }'
```

---

## Company APIs

### ➤ Get Company Fields

```
POST https://domain-name.com:3000/get-company-required-fields
```

#### CURL Example

```bash
curl -X POST https://domain-name.com:3000/get-company-required-fields \
-H "Content-Type: application/json" \
-d '{
      "access_token": "YOUR_TOKEN",
    }'
```

### ➤ Create Company

```
POST http://test-domain/hubspot/companies
```

#### CURL Example

```bash
curl -X POST https://domain-name.com:3000/create-company \
-H "Content-Type: application/json" \
-d '{
      "access_token": "YOUR_TOKEN",
      "name": "Acme Corp",
      "domain": "acme.com",
      "phone": "+1234567890",
      "city": "New York",
      "country": "USA"
    }'
```

---

# Authentication

All APIs require:

```
access_token
```

 You must provide a valid HubSpot Private App Access Token.

---

# Example Request

```json
{
  "access_token": "your_token_here",
  "email": "john@example.com",
  "firstname": "John",
  "lastname": "Doe"
}
```
---

#  Notes

* Make sure Node server is running before using UI
* Token must be valid (HubSpot)

---
