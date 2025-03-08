# Remote Keyboard WebApp

## Overview

Remote Keyboard WebApp is a browser-based application that allows multiple users to interact with a shared virtual keyboard. The keyboard consists of a grid of keys that light up in different colors when clicked. Users must acquire control of the keyboard before interacting with it, and control is automatically released after a key is pressed or after a timeout period.

## UI

![Keyboard UI](https://github.com/darshanjain1/Remote-keyboard-WebApp/blob/main/assets/keyboard-ui.png)

## Video

![Demo Video](https://drive.google.com/file/d/1m5h3rfq8Pze9PZRotRuMj13qw7PCPD8F/view)


## Features

- **Multi-user interaction**: Any number of users can participate in the keyboard interaction.
- **Dynamic Keyboard Grid**: Any number of keys for the keyboard can be added via the `constants` file.
- **Automatic Grid Adjustment**: The keyboard rows adjust dynamically based on the number of keys.
- **Key State Management**: Keys can be lit (colored) or turned off (white) based on user interaction.
- **Exclusive Keyboard Control**: Only one user can interact with the keyboard at a time.
- **Automatic Control Release**: Once a user lights a key, control is automatically released.
- **Control Timeout**: If a user does not interact for 120 seconds, control is released.
- **Real-Time Updates**: Changes are instantly reflected on all users' screens without requiring a page refresh (via socket.io).

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Knex.js Query builder
- **Real-Time Communication**: Socket.IO (for event-based interactions)

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js & npm**
- **MySQL Database**

### Steps to Set Up

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/darshanjain1/Remote-keyboard-WebApp.git
   cd Remote-keyboard-WebApp
   ```
2. **Install Dependencies**:
   ```sh
   npm install
   ```
3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root.
   - Add database configurations similar to:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=remote_keyboard
     ```
4. **Create the Database in MySQL**:
   - Open MySQL and run:
     ```sql
     CREATE DATABASE remote_keyboard;
     ```
5. **Run Database Migrations & Seed Data**:
   ```sh
   npm run migrate
   npm run run-seed
   ```
6. **Start the Application**:
   ```sh
   npm run dev
   ```
7. **Access the App**:
   Open a browser and visit: `http://localhost:3000`

## How It Works

1. **User Identification**:
   - Users are identified by passing a query string parameter, e.g., `?user=1`.
   - Example: `http://localhost:3000/keyboard?user=1`

2. **Acquiring Keyboard Control**:
   - A user clicks the "Acquire Control" button to gain exclusive access to the keyboard.
   - While a user has control, others must wait until control is released.

3. **Lighting Up Keys**:
   - When a user clicks on a key, it lights up with their assigned color.
   - After lighting a key, control is automatically released for other users.
   - Clicking on a lit key will turn it off.

4. **Control Timeout**:
   - If a user holds control but does not press a key for 120 seconds, control is auto-released.

5. **Real-Time Synchronization**:
   - Any action (key press, release, etc.) updates immediately on all connected users' screens using socket.io.

## Customization

- Modify the `constants` file to:
  - Increase/decrease the number of keys dynamically.
- The keyboard layout will automatically adjust based on the total keys configured.

## API Endpoints

| Method | Endpoint                    | Description                      |
| ------ | --------------------------- | -------------------------------- |
| GET    | `/keyboard`                 | Fetch the current keyboard state |
| GET    | `/keyboard/user/:id`        | Get user details by ID           |
| POST   | `/keyboard/acquire-control` | Acquire control of the keyboard  |
| POST   | `/keyboard/release-control` | Release control of the keyboard  |
| POST   | `/keyboard/press`           | Press a key on the keyboard      |

## Known Limitations

- Users are identified by query parameters (`?user=1, ?user=2`), which is a simple approach but does not involve authentication.

## Future Enhancements

- Add authentication and session management for better user tracking.

## License

This project is licensed under the MIT License.