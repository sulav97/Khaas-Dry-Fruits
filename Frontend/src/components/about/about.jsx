import React from "react";
import logo from "../../assets/khaas_logo.png";

export default function About() {
  return (
    <div className="flex-grow w-full bg-white text-gray-800 px-6 pt-16 pb-20 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Logo Section */}
        <div className="flex justify-center md:justify-end">
          <img
            src={logo}
            alt="Khaas Dry Fruits Logo"
            className="w-100 h-auto object-contain animate-fade-in transform -translate-y-10 -translate-x-10"
          />
        </div>

        {/* Text Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome to <span className="text-orange-600">Khaas Dry Fruits</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            We are a proud Nepali company delivering the finest, healthiest, and most flavorful dry fruits to your doorstep.
            Our focus on quality, authenticity, and local sourcing makes us unique.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-700">
              To provide premium dry fruits that not only nourish your body but also uplift Nepali communities and farmers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Our Vision</h2>
            <p className="text-gray-700">
              To become Nepal’s most trusted dry fruits brand through transparency, sustainability, and unwavering quality.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Locally Rooted:</strong> We proudly partner with Nepali farmers to support local livelihoods.</li>
              <li><strong>Premium Quality:</strong> Carefully curated for freshness, taste, and nutritional value.</li>
              <li><strong>Customer Commitment:</strong> Your satisfaction and wellness guide everything we do.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Nutritional Facts Info */}
      <div className="mt-24 max-w-4xl text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nutritional Facts of Dry Fruits</h2>
        <p className="text-gray-700 text-base leading-relaxed">
          Dry fruits are powerhouse snacks loaded with essential nutrients. They are rich in fiber, healthy fats, proteins,
          and antioxidants. Including a variety of dry fruits in your daily diet can promote heart health, aid in digestion,
          boost energy, and support overall immunity.
        </p>
      </div>

      {/* Nutrition Comparison Table */}
      <div className="mt-12 w-full max-w-5xl">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
          Nutrition per 100g of Dry Fruits
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center text-gray-800">
            <thead className="bg-orange-100">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold">Dry Fruit</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold">Calories</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold">Carbs</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold">Protein</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold">Fat</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Cashews", cal: "553 kcal", carbs: "30g", protein: "18g", fat: "44g" },
                { name: "Almonds", cal: "579 kcal", carbs: "22g", protein: "21g", fat: "50g" },
                { name: "Pistachios", cal: "562 kcal", carbs: "28g", protein: "20g", fat: "45g" },
                { name: "Walnuts", cal: "654 kcal", carbs: "14g", protein: "15g", fat: "65g" },
                { name: "Raisins", cal: "299 kcal", carbs: "79g", protein: "3g", fat: "0.5g" },
                { name: "Dates", cal: "277 kcal", carbs: "75g", protein: "2g", fat: "0.2g" },
                { name: "Anjeer", cal: "249 kcal", carbs: "64g", protein: "3g", fat: "0.9g" },
              ].map((item) => (
                <tr key={item.name} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">{item.name}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{item.cal}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{item.carbs}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{item.protein}</td>
                  <td className="py-3 px-4 border-b border-gray-200">{item.fat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
