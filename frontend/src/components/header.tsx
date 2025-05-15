import React, { useState } from "react";
import image from "./assets/Image1.png"
import {
  Moon,
  Sun,
  UserCircle,
  LogOut,
  Settings,
  Download,
  Home,
} from "lucide-react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [periodMode, setPeriodMode] = useState<"realtime" | "custom">("realtime");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const username = localStorage.getItem("username") || "User";

  return (
    <header className="w-full px-6 py-3 bg-gradient-to-r from-green-700 to-blue-600 text-white flex justify-between items-center shadow z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src={image} alt="image" className="image" />
      </div>

      {/* Time Picker */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 bg-gray-100 text-black px-4 py-2 rounded-lg text-sm">
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              value="realtime"
              checked={periodMode === "realtime"}
              onChange={() => setPeriodMode("realtime")}
            />
            <span>🟢 Temps Réel</span>
          </label>
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              value="custom"
              checked={periodMode === "custom"}
              onChange={() => setPeriodMode("custom")}
            />
            <span>📅 Période personnalisée</span>
          </label>
        </div>

        {periodMode === "custom" && (
          <div className="flex items-center space-x-2">
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="bg-white p-1 rounded border border-gray-300"
              placeholderText="Début"
            />
            <span className="mx-1">→</span>
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="bg-white p-1 rounded border border-gray-300"
              placeholderText="Fin"
            />
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center space-x-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-white text-black w-9 h-9 rounded-full flex items-center justify-center"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Dropdown */}
       
      </div>
    </header>
  );
};

export default Header;
