import React from 'react';
import Link from 'next/link';
import { Shield, Rocket, Clock, Target, Award } from 'lucide-react';

const InstructionsPage = () => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/EmptyBackground.PNG')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: 'rtl'
      }}
    >
      <div className="max-w-3xl bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-8 border border-white/20">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="text-center relative">
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full" />
          <h1 className="text-4xl font-bold text-blue-700 mb-4">סימולטור מיומנות</h1>
          <p className="text-lg text-gray-600">מכין את המשתמש להיות לזמן המאמן, ומתמקד במיומנויות הנדרשות בו!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InstructionCard
            icon={<Clock className="w-8 h-8 text-blue-500" />}
            title="זמן "
            content="בחלונית הפרטים על המטרה מופיע טיימר מציין כמה שניות נשארו עד שאי אפשר כבר יהיה ליירט את הטיל."
          />
          
          <InstructionCard
            icon={<Shield className="w-8 h-8 text-green-500" />}
            title="מה ליירט"
            content="לאחר לחיצה על מטרה מסוימת, נבחין בחלונית פרטי המטרה על היעד שלה. מטרה שנופלת בעיר היא מטרה שמהווה איום, ושצריך ליירט ולעומת זאת מטרה שתיפול בשטח פתוח אינה מהווה איום."
          />
          
          <InstructionCard
            icon={<Rocket className="w-8 h-8 text-red-500" />}
            title="בחירת מטרה"
            content="על מנת לבחור מטרה יש ללחוץ עליה."
          />
          
          <InstructionCard
            icon={<Target className="w-8 h-8 text-purple-500" />}
            title="מטרת הסימולטור"
            content="מטרת הסימולטור היא לחסוך במשאב המאמן, תוך מתן התנסות במיומנויות הנדרשות במאמן עצמו."
          />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3" />
            טיפים חשובים:
          </h3>
          <ul className="list-none mr-5 text-blue-700 space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>סדר את מסך הסימולטור בצורה שתהיה לך נוחה לשימוש - סידור החלוניות הנגררות על המסך</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>שים לב ליעד הסופי של הטיל ויירט רק את הטילים המהווים</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>נהל את משאבי היירוט שלך בתבונה</span>
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/sadirLogin/simulator"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Award className="ml-2" />
            התחל סימולציה
          </Link>
        </div>
      </div>
    </div>
  );
};

const InstructionCard = ({ icon, title, content }) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-xl font-bold mr-3 group-hover:text-blue-600 transition-colors">{title}</h2>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default InstructionsPage;