import React, { useState, useEffect } from "react";
import axios from "axios";
import withAuth from "../Auth/Authentication";

function EntryPage() {
  const [khataName, setKhataName] = useState("");
  const [khataList, setKhataList] = useState([]);
  const [selectedKhata, setSelectedKhata] = useState("");
  const [showAddKhata, setShowAddKhata] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [sateNo, setSateNo] = useState("");
  const [totalPips, setTotalPips] = useState("");
  const [pipsNumbers, setPipsNumbers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKhatas();
  }, []);

  const fetchKhatas = async () => {
    try {
      const id = localStorage.getItem("id");
      const res = await axios.get("http://localhost:5000/api/khatas", {
        params: { id },
      });
      setKhataList(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch khatas. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (khataName.trim() !== "") {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const response = await fetch("http://localhost:5000/api/khatas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Name: khataName, userid: id }),
        });
        if (!response.ok) {
          throw new Error("Failed to add khata");
        }
        const data = await response.json();
        setKhataList([...khataList, data]);
        setKhataName("");
        setShowAddKhata(false);
      } catch (error) {
        console.error("Error adding khata:", error);
        setError("Failed to add khata. Please try again.");
      }
    }
  };

  const handleKhataSelect = (e) => {
    setSelectedKhata(e.target.value);
    setShowForm(true);
  };

  const handleTotalPipsChange = (e) => {
    const total = parseInt(e.target.value, 10);
    if (isNaN(total) || total < 0 || total > 1000) {
      setError(
        "Please enter a valid number between 0 and 1000 for Total Pips."
      );
      setTotalPips("");
      setPipsNumbers([]);
    } else {
      setError("");
      setTotalPips(total);
      setPipsNumbers(Array(total).fill(""));
    }
  };

  const handlePipsNumberChange = (index, value) => {
    const newPipsNumbers = [...pipsNumbers];
    newPipsNumbers[index] = value;
    setPipsNumbers(newPipsNumbers);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log({
      selectedKhata,
      selectedDate,
      sateNo,
      totalPips,
      pipsNumbers,
    });
    setShowForm(false);
    setSelectedDate("");
    setSateNo("");
    setTotalPips("");
    setPipsNumbers([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Khata Management</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            {!showAddKhata ? (
              <button
                onClick={() => setShowAddKhata(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add New Khata
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="text"
                  value={khataName}
                  onChange={(e) => setKhataName(e.target.value)}
                  placeholder="Enter Khata Name"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Khata
                </button>
              </form>
            )}
          </div>
          <div className="w-full sm:w-1/2">
            <select
              value={selectedKhata}
              onChange={handleKhataSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            >
              <option value="">Select Khata</option>
              {khataList?.map((khata) => (
                <option key={khata.id} value={khata.id}>
                  {khata.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Enter Khata Details</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div>
                <label
                  htmlFor="sateNo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sate No
                </label>
                <input
                  type="number"
                  id="sateNo"
                  value={sateNo}
                  onChange={(e) => setSateNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div>
                <label
                  htmlFor="totalPips"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Pips
                </label>
                <input
                  type="number"
                  id="totalPips"
                  value={totalPips}
                  onChange={handleTotalPipsChange}
                  required
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
            </div>

            {totalPips > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Pips Numbers</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {pipsNumbers.map((pipNumber, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`pip-${index + 1}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pip {index + 1}
                      </label>
                      <input
                        type="number"
                        id={`pip-${index + 1}`}
                        value={pipNumber}
                        onChange={(e) =>
                          handlePipsNumberChange(index, e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Khata Details
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default withAuth(EntryPage);
