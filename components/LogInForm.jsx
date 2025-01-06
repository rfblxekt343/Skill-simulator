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
    console.log(process.env.MONGODB_URI);
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
   const handleStartSadir = () =>{
    router.push("/sadirLogin");
   }

  return (
    <div
      className="min-h-screen h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.PNG')" }}
    >
 <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-blue-300/10 rounded-2xl 
                    shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/30 p-8
                    transform transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        
        {/* Header with decorative elements */}
        <div className="relative mb-10">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-300/20 rounded-full blur-xl"></div>
          <h1 className="text-3xl font-bold text-center text-blue-50 relative">
            פרטי התחברות
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="relative">
            <legend className="text-right text-xl font-medium text-blue-50 mb-6 
                           after:content-[''] after:block after:w-16 after:h-0.5 after:bg-blue-300/30 after:mt-2">
              התחבר כ
            </legend>
            
            <div className="flex justify-end gap-8">
              {/* Malshab Radio */}
              <div className="form-control">
                <label className="label cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="malshab"
                    checked={form.role === "malshab"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                               group-hover:bg-blue-400/10">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-200 relative
                                transition-all duration-300 group-hover:border-blue-300">
                      <div className={`absolute inset-1 rounded-full bg-blue-200 transform transition-all duration-300
                                  ${form.role === "malshab" 
                                    ? "scale-100 opacity-100" 
                                    : "scale-0 opacity-0"}`}>
                      </div>
                    </div>
                    <span className="text-lg text-blue-50 group-hover:text-blue-200 transition-colors">
                      מלש&quot;ב
                      (סימולטור מיומנות)
                    </span>
                  </div>
                </label>
              </div>
              
              {/* Sadir Radio */}
              <div className="form-control">
                <label className="label cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="sadir"
                    checked={form.role === "sadir"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                               group-hover:bg-blue-400/10">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-200 relative
                                transition-all duration-300 group-hover:border-blue-300">
                      <div className={`absolute inset-1 rounded-full bg-blue-200 transform transition-all duration-300
                                  ${form.role === "sadir" 
                                    ? "scale-100 opacity-100" 
                                    : "scale-0 opacity-0"}`}>
                      </div>
                    </div>
                    <span className="text-lg text-blue-50 group-hover:text-blue-200 transition-colors">
                      סדיר
                      (משחק יירוט)
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </fieldset>

          {/* Sadir Button */}
          {form.role === "sadir" && (
            <button
              type="button"
              onClick={handleStartSadir}
              className="group relative w-full py-4 bg-gradient-to-r from-blue-400 to-blue-500 
                      text-white text-lg font-semibold rounded-xl
                      transition-all duration-300 ease-out 
                      shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)]
                      hover:translate-y-[-2px] active:translate-y-[0px]
                      overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl transition-transform duration-300 
                           group-hover:scale-[2.5] opacity-0 group-hover:opacity-100"></div>
              <span className="relative">התחל סימולציה</span>
            </button>
          )}

          {/* Malshab Button */}
          {form.role === "malshab" && (
            <button
              type="button"
              onClick={handleStartGame}
              className="group relative w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 
                      text-white text-lg font-semibold rounded-xl
                      transition-all duration-300 ease-out 
                      shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]
                      hover:translate-y-[-2px] active:translate-y-[0px]
                      overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl transition-transform duration-300 
                           group-hover:scale-[2.5] opacity-0 group-hover:opacity-100"></div>
              <span className="relative">התחל משחק</span>
            </button>
          )}

          {/* Status Message */}
          {status && (
            <div className="relative">
              <div className="absolute inset-0 blur-lg opacity-50 
                           bg-gradient-to-r from-transparent via-current to-transparent"></div>
              <p className={`relative mt-6 text-right font-semibold text-lg
                ${status.includes("בהצלחה") 
                  ? "text-emerald-300" 
                  : "text-red-300"
                }`}>
                {status}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
     // <div>
            //   <div className="form-group flex flex-col items-end">
            //     <label className="text-sm text-white font-semibold shadow-sm">
            //       מספר תעודת זהות
            //     </label>
            //     <input
            //       type="text"
            //       name="idNumber"
            //       value={form.idNumber}
            //       onChange={handleChange}
            //       className="input input-bordered w-full p-2 border-gray-300 rounded-lg focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            //       required
            //     />
            //   </div>


            //   <div className="form-group flex flex-col items-end">
            //     <label className="text-sm text-white font-semibold shadow-sm">
            //       שם מלא
            //     </label>
            //     <input
            //       type="text"
            //       name="fullName"
            //       value={form.fullName}
            //       onChange={handleChange}
            //       className="input input-bordered w-full p-2 border-gray-300 rounded-lg focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            //       required
            //     />
            //   </div>

            //   <button
            //     type="submit"
            //     className="btn w-full py-3 px-4 bg-lime-500 text-white text-lg font-semibold rounded-lg hover:bg-lime-600 transition-all duration-200 ease-in-out"
            //     disabled={loading}
            //   >
            //     {loading ? (
            //       <span className="loading loading-spinner text-white"></span>
            //     ) : (
            //       "שלח"
            //     )}
            //   </button>
            // </div>