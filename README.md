# Dishi Food Ordering App Backend System.
Dishi is a Food Ordering Backend System written in Node.js and TypeScript. It utilizes MongoDB as the database with the help of the Mongoose ODM (Object Data Modeling), and implements caching using Redis. This README.md file provides a comprehensive guide to understanding and working with the Dishi backend system.

## Features

Dishi offers the following key features:

- User management: Registering new users, authenticating users, and managing user profiles.
- Restaurant management: Adding and updating restaurant details, managing menus, and handling orders.
- Menu management: Creating and updating menus, managing dishes and their availability.
- Order management: Placing and tracking orders, handling payment integration, and providing real-time status updates.
- Caching: Implementing caching mechanisms using Redis for improved performance and reduced database load.

## Prerequisites

Before getting started with the Dishi backend system, make sure you have the following prerequisites installed:

- Node.js (version 12 or above)
- MongoDB (running instance or connection URI)
- Redis (running instance)

## Installation

To install and set up the Dishi backend system, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/TheAlchemistKE/dishi-backend.git
   cd dishi-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configuration:

   - Rename the `.env.example` file to `.env`.
   - Open the `.env` file and provide the necessary configuration parameters such as MongoDB connection URI, Redis host, and port.

4. Run the application:

   ```bash
   make run
   ```

   The application will start on the specified port (default is 3000) and connect to the MongoDB and Redis instances based on the provided configuration.


## Project File Structure
The Dishi backend system follows a modular and organized structure to promote maintainability and scalability. Here's an overview of the project structure:
```
├── .env.example
├── .eslintrc.js
├── .github
│   └── workflows
│       ├── deploy.yml
│       └── linter.yml
├── .prettierrc
├── Dockerfile
├── LICENSE
├── Makefile
├── README.md
├── babel.config.js
├── deploy.sh
├── docker-compose.yml
├── git-commit.md
├── index.ts
├── jest.config.js
├── lint.sh
├── package-lock.json
├── package.json
├── src
│   ├── api
│   │   ├── controllers
│   │   │   ├── admin.controller 2.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── customer.controller.ts
│   │   │   ├── index.ts
│   │   │   ├── shopping.controller.ts
│   │   │   └── vendor.controller.ts
│   │   ├── dto
│   │   │   ├── admin.dto.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── customer.dto.ts
│   │   │   ├── food.dto.ts
│   │   │   ├── index.ts
│   │   │   ├── offer.dto.ts
│   │   │   └── vendor.dto.ts
│   │   └── middlewares
│   │       ├── common_auth.ts
│   │       └── index.ts
│   ├── config
│   │   └── index.ts
│   ├── database
│   │   ├── base
│   │   │   ├── base.repository.ts
│   │   │   └── index.ts
│   │   ├── interfaces
│   │   │   ├── index.ts
│   │   │   ├── reader.interface.ts
│   │   │   └── writer.interface.ts
│   │   ├── models
│   │   │   ├── customer.model.ts
│   │   │   ├── delivery.model.ts
│   │   │   ├── delivery_user.model.ts
│   │   │   ├── food.model.ts
│   │   │   ├── index.ts
│   │   │   ├── offer.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── vendor.model.ts
│   │   └── repositories
│   │       ├── customer.repository.ts
│   │       ├── delivery.repository.ts
│   │       ├── delivery_user.repository.ts
│   │       ├── food.repository.ts
│   │       ├── index.ts
│   │       ├── offer.repository.ts
│   │       ├── order.repository.ts
│   │       └── vendor.repository.ts
│   ├── interfaces
│   │   ├── index.ts
│   │   ├── request.interface.ts
│   │   └── response.interface.ts
│   ├── routes
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── customer.routes.ts
│   │   ├── delivery.routes.ts
│   │   ├── index.ts
│   │   ├── shopping.routes.ts
│   │   └── vendor.routes.ts
│   ├── services
│   │   ├── customer.service.ts
│   │   └── vendor.service.ts
│   └── utils
│       ├── index.ts
│       └── password_utility.ts
├── test
│   ├── performance
│   │   └── load-test.yml
│   └── unittest
│       ├── customer.test.ts
│       ├── food.test.ts
│       └── vendor.test.ts
└── tsconfig.json
```

## Development

To contribute or modify the Dishi backend system, consider the following guidelines:

- Write clean and modular code following TypeScript and Node.js best practices.
- Maintain proper separation of concerns by organizing code into appropriate directories.
- Include unit tests for new features and bug fixes.
- Run the existing test suite before submitting any changes.
- Follow the Git branching model (e.g., feature branches, pull requests) for collaboration.

## Testing

The Dishi backend system utilizes the Jest testing framework for unit tests. To run the tests, use the following command:

```bash
npm test
```

The test suite can be found in the `test/` directory and covers various aspects of the backend system's functionality.

## Contributing

Contributions to the Dishi backend system are welcome! If you encounter any issues, feel free to open an issue in the project repository. For contributions, please follow the guidelines mentioned in the CONTRIBUTING.md file.

## License

Dishi is open-source and released under the [MIT License](LICENSE). You are free to use, modify, and distribute the codebase as per the terms of the license.

## Contact

For any further questions or inquiries, please contact the project maintainers:

- Kelyn Njeri - kelyn.njeri@gmail.com


## Acknowledgments

We would like to thank the following individuals and projects for their contributions and inspiration:

- The creators and maintainers of Node.js, TypeScript, MongoDB, Mongoose, Redis, and other open-source libraries used in this project.

---

Thank you for using Dishi! We hope this backend system helps you build a powerful and efficient food ordering application.