import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instructor: "",
    program: "Trial Class",
    timeslot: "Morning",
    message: "",
  });

  const [instructors, setInstructors] = useState([]);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------
     FETCH INSTRUCTORS (DYNAMIC)
  -------------------------------- */
  useEffect(() => {
    async function fetchInstructors() {
      try {
        const res = await api.get("/instructors");
        // Expecting array of instructor objects with `name`
        setInstructors(res.data || []);
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    }

    fetchInstructors();
  }, []);

  /* -------------------------------
     SUBMIT FORM
  -------------------------------- */
  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      await api.post("/bookings", form);

      setMsg(
        "Booking request sent successfully. You will receive a call shortly from our team."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        instructor: "",
        program: "Trial Class",
        timeslot: "Morning",
        message: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to send booking request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 px-4 py-12">
      <div className="max-w-md mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Book a Trial Session
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Fill in the details and our team will contact you shortly.
        </p>

        {msg && (
          <div className="mb-4 text-sm text-center bg-teal-100 text-teal-800 px-4 py-3 rounded-lg">
            {msg}
          </div>
        )}

        <form
          onSubmit={submit}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          {/* Name */}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          {/* Email */}
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="Email Address"
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          {/* Phone */}
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            type="tel"
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Instructor (DYNAMIC) */}
          <select
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">Select Instructor (Optional)</option>
            {instructors.map((ins) => (
              <option key={ins._id || ins.name} value={ins.name}>
                {ins.name}
              </option>
            ))}
          </select>

          {/* Program (STATIC) */}
          <select
            value={form.program}
            onChange={(e) => setForm({ ...form, program: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option>Trial Class</option>
            <option>Yoga Class</option>
            <option>Meditation Session</option>
          </select>

          {/* Timeslot (STATIC) */}
          <select
            value={form.timeslot}
            onChange={(e) => setForm({ ...form, timeslot: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>

          {/* Message */}
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message (optional)"
            className="w-full border px-3 py-2 rounded-lg"
            rows="3"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all disabled:opacity-60"
          >
            {loading ? "Sending..." : "Request Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
