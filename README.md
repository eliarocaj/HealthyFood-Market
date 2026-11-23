# HealthyFood Market – E-Commerce Web Application

**Full-Stack Academic Project | Software Engineering**

## Project Overview

HealthyFood Market is a full-stack e-commerce web application developed as a university academic project and presented as a functional application.

The project provides an online shopping experience focused on healthy food products, allowing users to browse products, filter items according to dietary preferences, manage their shopping cart, and place demo orders.

The application also includes a rule-based virtual assistant and Progressive Web App (PWA) functionality.

## Key Features

- **Product Catalog:** Browse healthy food products with information about ingredients, allergens, nutritional values, and prices.
- **Search and Filtering:** Search products by name and filter by category or dietary preferences, including vegan, keto, and gluten-free options.
- **Shopping Cart:** Add and remove products, update quantities, and calculate the total price automatically.
- **Demo Checkout:** Submit orders with customer information and receive an order confirmation.
- **Virtual Assistant:** Rule-based chatbot providing basic dietary product suggestions.
- **PWA Support:** Installable web application with offline caching for selected resources.
- **Order Management:** Server-side order processing with JSON-based data storage.

## Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API endpoints

**Data Storage**
- JSON files
- Browser Local Storage

**Additional Technologies**
- Progressive Web App (PWA)
- Service Workers
- Web App Manifest

## Project Structure

```text
HealthyFood-Market/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.webmanifest
│   └── sw.js
├── data/
│   └── products.json
├── server.js
├── package.json
└── README.md
```

## How to Run the Project

1. Install Node.js.
2. Clone the repository.
3. Open the project directory.
4. Install dependencies:

```bash
npm install
```

5. Start the application:

```bash
npm start
```

6. Open the following address in your browser:

```text
http://localhost:5173
```

## Project Purpose

The purpose of this academic project was to apply software engineering and web development concepts through the development of a functional e-commerce prototype.

The project demonstrates frontend development, backend API implementation, client-server communication, data handling, and user interface design.

## Limitations

This application is an educational prototype. Checkout functionality is demonstrative, and no real payment processing is integrated.

The virtual assistant uses predefined rules rather than a machine-learning model. Product and order data are stored locally in JSON files rather than in a production database.

## Author

**Elia Roçaj**

MSc Software Engineering Student
Mesdhetar University
[GitHub Profile](https://github.com/eliarocaj)

*Developed and presented as a university academic project.*
