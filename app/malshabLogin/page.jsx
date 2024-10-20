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
      <div className="max-w-3xl bg-white/95 backdrop-blur shadow-xl rounded-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">ברוכים הבאים למשחק יירוט הטילים</h1>
          <p className="text-lg text-gray-600">הגן על ערי ישראל מפני טילים נכנסים</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InstructionCard
            icon={<Clock className="w-8 h-8 text-blue-500" />}
            title="זמן המשחק"
            content="יש לך דקה וחצי ליירט כמה שיותר טילים"
          />
          
          <InstructionCard
            icon={<Shield className="w-8 h-8 text-green-500" />}
            title="מצב יירוט"
            content="לחץ על כפתור 'התחל יירוט' כדי להיכנס למצב יירוט פעיל"
          />
          
          <InstructionCard
            icon={<Rocket className="w-8 h-8 text-red-500" />}
            title="בחירת מטרה"
            content="לחץ על הטיל שברצונך ליירט. טילים אדומים הם בעדיפות גבוהה"
          />
          
          <InstructionCard
            icon={<Target className="w-8 h-8 text-purple-500" />}
            title="ניקוד"
            content="קבל נקודות על כל יירוט מוצלח. טילים אדומים מזכים בנקודות כפולות"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <h3 className="text-lg font-bold text-blue-800 mb-2">טיפים חשובים:</h3>
          <ul className="list-disc mr-5 text-blue-700 space-y-2">
            <li>התמקד בטילים אדומים - הם המסוכנים ביותר</li>
            <li>שים לב למהירות הטיל ולמסלול שלו</li>
            <li>נהל את משאבי היירוט שלך בתבונה</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/malshabLogin/game" 
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            <Award className="ml-2" />
            התחל משחק
          </Link>
        </div>
      </div>
    </div>
  );
};

const InstructionCard = ({ icon, title, content }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-bold mr-3">{title}</h2>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default InstructionsPage;