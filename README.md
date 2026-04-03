# 📊 Finance Dashboard

A modern, responsive, and robust personal finance dashboard built with **React**, **Redux Toolkit**, and **Tailwind CSS**. This application explores complex state management, data visualization, and Role-Based Access Control (RBAC) in a highly modular architecture.

---

## 📸 Screenshots

*(Replace the placeholder links below with the paths to the screenshots you captured!*

![User Dashboard Profile - Overview & Actions](/screenshots/img1.png)

![Transactions Viewer - Filtering & Pagination](/screenshots/img2.png)

---

## ✨ Key Features

* **Rich Data Visualization**: Beautifully responsive charts (Bar, Pie, Line) providing immediate insights into spending habits and balance trends. 
* **Advanced State Management**: Built using a carefully decoupled **Redux Toolkit (RTK)** store. Features robust data persistence tracking directly synced with local storage and memoized selectors to optimize UI rendering performance.
* **Role-Based Access Control (RBAC)**: Includes specialized views and data segregation for `Admin` vs `Viewer` roles. 
  * *Admins* have full mutating privileges (add, edit, delete) and an exclusive Dashboard setup.
  * *Viewers* are restricted to safely exploring charts and insights without the ability to mutate system data.
* **Component-Driven Architecture**: Fully adheres to Atomic design principles. The UI logic is highly modularized (`ui`, `layout`, `features`), making styling changes effortless and predictable.
* **Exceptional UX / UI Ecosystem**:
  * Persistent **Light/Dark Mode** synchronized via Redux.
  * Extensively animated layouts avoiding jarring data refreshes.
  * Built fully responsive for Mobile, Tablet, and Desktop using utility-first CSS styling (Tailwind).

---

## 🏗️ Overview of Approach

The core premise behind this application's architecture was "Scalability." While a simpler context tool could have been used, Redux Toolkit was explicitly chosen to showcase enterprise patterns.

1. **State Isolation**: Actions, reducers, and selectors (`transactionsSelectors.js`) are decoupled from components. Business logic sits outside of the component lifecycle, meaning the data strictly drives the View.
2. **Middleware & Interceptors**: Custom Redux localStorage middleware handles background-saving so the main UI thread never hangs when appending new transaction data.
3. **Form Management**: Edit/Add modally-persistent states were synchronized properly using component lifecycle hooks to squash staleness bugs typical to React applications.
4. **Visual Library Independence**: Core components (like `<Card>`, `<Button>`) are wrapped. Though using Tailwind classes, the app does not strongly couple custom logic to styling, preventing 'vendor lock-in'.

---

## 🛠️ Technical Stack

- **Core**: React 18, Vite
- **State Management**: Redux Toolkit (RTK), React-Redux
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Browser Persistence**: Custom RTK Middleware (Local Storage Payload Synchronizer)

---

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/navadeep11/finance-dashboard.git
   cd finance-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Ensure you have Node.js v16+ installed)*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Visit the app**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Deployed app**:
   Open (https://finance-dashboard-track.netlify.app/) in your browser.

### Developer Tips
- You can toggle the active user Role (Admin/Viewer) from the Top Navigation bar.
- Transactions are automatically persisted to your browser's local storage. To reset data to mock values, you can run `localStorage.clear()` in your browser console and refresh.
