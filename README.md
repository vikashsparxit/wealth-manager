
# **Family Wealth Manager Dashboard**  

## **Project Overview**  
The **Family Wealth Manager Dashboard** is a personal finance tool designed to help families manage and track their wealth across multiple asset classes. It simplifies investment tracking, provides insights into growth trends, and offers detailed family and individual wealth summaries.  

---

## **Features**  

### **1. Investment Tracking**  
- Add and categorize investments by asset type, owner, and value.  
- Track invested amount, current value, and growth over time.  

### **2. Wealth Summary**  
- View combined family wealth and individual contributions.  
- Real-time calculations for **Total Wealth**, **Growth Percentage**, and **Liquid Assets**.  

### **3. Asset Classes Supported**  
- **Precious Metals**: Physical Gold, Digital Gold, SGB  
- **Equities**: Stocks, Mutual Funds, ETFs, Pre-IPO Investments  
- **Insurance**: LIC, ULIP  
- **Fixed Income**: PPF, NPS, Bonds  
- **Alternative Investments**: Startups, Real Estate  

### **4. Visual Insights**  
- Graphs and charts powered by **Chart.js** for investment trends and ROI analysis.  

### **5. User Management**  
- Track investments for family members (Spouse, Children, etc.) and manage their individual wealth reports.  
- Role-based summaries (e.g., Combined Family View, Individual View).  

### **6. Sharing and Reports**  
- Generate live reports to share with family members or stakeholders.  
- Export wealth summaries in **PDF** or **CSV** formats.  

---

## **Tech Stack**  

### **Frontend**  
- **React** with **TypeScript**  
- **Vite** as the build tool  
- **Tailwind CSS** for styling  
- **shadcn/ui**: Pre-built UI components  
- **lucide-react**: Icon library  

### **State Management & Data**  
- **React Query** for server state management and data fetching  
- **React Context** for global state  

### **Backend & Database**  
- **Supabase** for:  
  - Authentication  
  - Database (PostgreSQL)  
  - Real-time subscriptions  
  - Edge Functions  

### **Routing**  
- **react-router-dom** for client-side routing  

### **Development Tools**  
- **TypeScript** for type safety  
- **ESLint** for code linting  
- **PostCSS** for CSS processing  
- **SWC** (via Vite) for fast compilation  

---

## **Getting Started**  

### **Prerequisites**  
- Node.js (v16 or above)  
- npm or yarn installed  

### **Clone the Repository**  
```bash
git clone https://github.com/vikashsparxit/wealth-manager.git
cd wealth-manager
```

### **Install Dependencies**  
```bash
npm install
```

### **Run the Development Server**  
```bash
npm run dev
```

### **Build for Production**  
```bash
npm run build
```

### **Environment Variables**  
Create a `.env` file in the root directory to configure environment variables:  
```plaintext
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

---

## **Folder Structure**  
```
wealth-manager/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── contexts/         # Global state management
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # API functions (Supabase)
│   ├── styles/           # Tailwind CSS configuration
│   ├── utils/            # Utility functions
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── package.json          # Project configuration
└── vite.config.ts        # Vite configuration
```

---

## **Future Improvements**  
- Add biometric security (Face ID/Touch ID) for access.  
- Integrate AI-based investment suggestions.  
- Enhance real-time collaboration for shared wealth tracking.  

---

## **Contributing**  
We welcome contributions! Please follow these steps:  
1. Fork the repository.  
2. Create a new branch: `git checkout -b feature/your-feature-name`.  
3. Commit your changes: `git commit -m "Add new feature"`.  
4. Push to your branch: `git push origin feature/your-feature-name`.  
5. Submit a pull request.  

---

## **License**  
This project is open-sourced under the MIT License.  

---

## **Contact**  
For questions, feedback, or collaborations, feel free to connect:  
- **Vikash Sharma**  
- LinkedIn: [vikashsparxit](https://linkedin.com/in/vikashsparxit)  
- GitHub: [vikashsparxit](https://github.com/vikashsparxit)
