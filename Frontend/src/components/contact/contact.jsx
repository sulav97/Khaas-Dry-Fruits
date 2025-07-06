import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const faqs = [
    {
      question: "What are your business hours?",
      answer: "We are open Monday to Friday, 9:00 A.M to 6:00 P.M.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can email us at khaasdryfruits@gmail.com or call 9825956956.",
    },
    {
      question: "Where is your store located?",
      answer: "Dot Trade, Kapan, Kathmandu, Nepal.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within Nepal only.",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-16 text-black flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Feel free to ask any questions or reach out for support.
          </p>
        </div>

        {/* Info + Form */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Info Box */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-black">Contact Information</h2>
            <p className="text-sm text-gray-600">
              Reach out to us if you have questions or need help.
            </p>
            <div className="space-y-2 text-sm text-black">
              <p><strong>Email:</strong> khaasdryfruits@gmail.com</p>
              <p><strong>Phone:</strong> 9825956956</p>
              <p><strong>Location:</strong> Dot Trade, Kapan, Kathmandu</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Question</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder="How can we help you?"
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <h2 className="text-xl font-semibold px-6 pt-6 text-black">Our Store Location</h2>
          <div className="px-6 pb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8098721310366!2d85.35553837534103!3d27.692567376192988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1bb297270d3f%3A0x7bce0075d98f7859!2sDot%20Trade!5e0!3m2!1sen!2snp!4v1719828582076!5m2!1sen!2snp"
              width="100%"
              height="300"
              allowFullScreen
              loading="lazy"
              title="Dot Trade, Kapan"
              className="rounded-md border border-gray-200"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <button
                  className="w-full text-left flex justify-between items-center font-medium text-gray-800"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  {faq.question}
                  <span className="text-xl">
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === index && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
