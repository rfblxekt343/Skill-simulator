"use client";
import React, { useState, useCallback, useEffect, useRef } from "react"; // Added useRef import
import { useRouter } from "next/navigation";

export default function LogInForm() {
  const [form, setForm] = useState({
    fullName: "",
    course: "",
    role: "malshab", // Setting a default value here
    idNumber: "",
  });

  const router = useRouter();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(); // If you're using this, define it here

  const handleChange = useCallback((e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    // For debugging purposes, check the state on render
    console.log("Current role:", form.role);
  }, [form.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.idNumber) {
      setStatus("נא למלא את כל השדות.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("הטופס נשלח בהצלחה!");
        setForm({
          fullName: "",
          course: "",
          role: "malshab", // Resetting to default role
          idNumber: "",
        });

        if (form.role === "malshab") {
          router.push("/malshabLogin");
        } else {
          router.push("/sadirLogin");
        }
      } else {
        setStatus("נכשל לשלוח את הטופס.");
      }
    } catch (error) {
      setStatus("אירעה שגיאה בעת שליחת הטופס.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    router.push("/malshabLogin");
  };

  return (
    <div
      className="min-h-screen h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.PNG')" }}
    >
       <div
        className="container mx-auto p-6 max-w-lg card bg-white shadow-lg rounded-lg"
        style={{
          backgroundImage: "url('/formBackground.jpg')",
          backgroundSize: "contain", 
          backgroundSize: "cover", // Ensure the background covers the whole container
          backgroundRepeat: "no-repeat", // Prevent the background from repeating
          backgroundPosition: "center", // Center the background image
          //backgroundAttachment: "fixed",
        }}
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          פרטי התחברות
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <legend className="text-right text-lg font-medium text-white">
              מתחבר כ
            </legend>
            <div className="flex justify-end space-x-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="malshab"
                    checked={form.role === "malshab"}
                    onChange={handleChange}
                    className="radio checked:bg-lime-200"
                  />
                  <span className="label-text ml-2 text-white">מלש&quot;ב</span>

                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="sadir"
                    checked={form.role === "sadir"}
                    onChange={handleChange}
                    className="radio checked:bg-lime-200"
                  />
                  <span className="label-text ml-2 text-white">סדיר</span>
                </label>
              </div>
            </div>
          </fieldset>

          {form.role === "sadir" && (
            <div>
              <div className="form-group">
                <label className="text-right w-full text-sm text-gray-600">
                  מספר תעודת זהות
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full p-2 border-gray-300 rounded-lg focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  required
                />
              </div>

              <div className="form-group">
                <label className="text-right w-full text-sm text-gray-600">
                  שם מלא
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full p-2 border-gray-300 rounded-lg focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-full py-3 px-4 bg-lime-500 text-white text-lg font-semibold rounded-lg hover:bg-lime-600 transition-all duration-200 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  "שלח"
                )}
              </button>
            </div>
          )}

          {form.role === "malshab" && (
            <button
              type="button"
              className="btn w-full py-3 px-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
              onClick={handleStartGame}
            >
              התחל משחק
            </button>
          )}

          {status && (
            <p
              className={`mt-4 text-right font-semibold ${status.includes("בהצלחה") ? "text-lime-600" : "text-red-600"
                }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
