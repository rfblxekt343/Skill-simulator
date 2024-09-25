"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogInForm() {
  const [form, setForm] = useState({
    fullName: '',
    course: '',
    role: '', // Role field
    idNumber: '', // Add ID number field
  });

  const router = useRouter();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields before submission
    if (!form.fullName || !form.idNumber) {
      setStatus('נא למלא את כל השדות.');
      return;
    }
  
    setLoading(true);
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
  
    if (response.ok) {
      setStatus('הטופס נשלח בהצלחה!');
      setForm({
        fullName: '',
        course: '',
        role: '', 
        idNumber: '', 
      });
  
      if (form.role === 'malshab') {
        router.push('/malshabLogin');
      } else {
        router.push('/sadirLogin');
      }
    } else {
      setStatus('נכשל לשלוח את הטופס.');
    }
    setLoading(false);
  };
  

  return (
    <div className="container mx-auto p-4 max-w-md card bg-lime-100 shadow-xl">
      <h1 className="text-xl font-bold mb-4 text-center">פרטי התחברות</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="mt-4">
          <legend className="block text-sm font-medium text-right">
            <span className="flex items-center justify-end">
              <span className="ml-1 text-lg">:</span>
              <span>מתחבר כ</span>
            </span>
          </legend>

          <div className="flex flex-col space-y-2 mt-2">
            {/* Replacing with DaisyUI radio buttons */}
            <div className="form-control">
              <label className="label cursor-pointer">
                
                <input
                  type="radio"
                  name="role"
                  value="malshab"
                  checked={form.role === 'malshab'}
                  onChange={handleChange}
                  className="radio checked:bg-lime-200"
                />
                <span className="label-text">מלש"ב</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                
                <input
                  type="radio"
                  name="role"
                  value="sadir"
                  checked={form.role === 'sadir'}
                  onChange={handleChange}
                  className="radio checked:bg-lime-200"
                />
                <span className="label-text">סדיר</span>
              </label>
            </div>
          </div>
        </fieldset>

        {/* Conditionally render fields based on the selected role */}
        {form.role && (
          <>
            <label className="input input-bordered flex items-center gap-2">

              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                className="grow"
                required
                
              />
              מספר תעודת זהות
            </label>

            <label className="input input-bordered flex items-center gap-2">
              
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="grow"
                required
                
              />
              שם מלא
            </label>

   

            <button
              type="submit"
              className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full py-2 px-4 bg-lime-300 text-white rounded-md flex justify-center"
              disabled={loading} // Disable the button when loading
            >
              {loading ? (
                <span className="loading loading-spinner text-primary"></span> // DaisyUI loading spinner
              ) : (
                'שלח'
              )}
            </button>
          </>
        )}

        {status && <p className="mt-4 text-right">{status}</p>}
      </form>
    </div>
  );
}
