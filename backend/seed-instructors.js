import mongoose from "mongoose";
import Instructor from "./models/Instructor.js";
import { geocodeAddress } from "./utils/geocode.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/zenflowdb";

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Instructor.deleteMany();

  const instructors = [
    {
      name: "Ananya Deshmukh",
      photo_url:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      bio: "Certified Hatha and Vinyasa yoga instructor with 7+ years of teaching experience.",
      specializations: ["Hatha Yoga", "Vinyasa", "Stress Relief"],
      contact_email: "ananya.yoga@gmail.com",
      phone: "+91 9876543210",
      centers: [
        {
          name: "Zen Pune Studio",
          address: "Baner, Pune, Maharashtra",
        },
      ],
    },
    {
      name: "Rohit Kulkarni",
      photo_url:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a",
      bio: "Ashtanga practitioner focused on strength, discipline, and alignment.",
      specializations: ["Ashtanga Yoga", "Power Yoga"],
      contact_email: "rohit.ashtanga@gmail.com",
      phone: "+91 9822011223",
      centers: [
        {
          name: "Mumbai Yoga Kendra",
          address: "Andheri West, Mumbai, Maharashtra",
        },
      ],
    },
    {
      name: "Sneha Patil",
      photo_url:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      bio: "Therapeutic yoga instructor specialising in mental wellness and anxiety management.",
      specializations: ["Therapeutic Yoga", "Meditation"],
      contact_email: "sneha.therapy@gmail.com",
      phone: "+91 9811144556",
      centers: [
        {
          name: "Mindful Space",
          address: "Kothrud, Pune, Maharashtra",
        },
      ],
    },
    {
      name: "Amit Joshi",
      photo_url:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
      bio: "Pranayama and breathwork expert helping professionals manage stress.",
      specializations: ["Pranayama", "Breathwork"],
      contact_email: "amit.prana@gmail.com",
      phone: "+91 9900077889",
      centers: [
        {
          name: "Calm Breaths Studio",
          address: "Dadar, Mumbai, Maharashtra",
        },
      ],
    },
    {
      name: "Neha Shah",
      photo_url:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      bio: "Beginner-friendly yoga instructor focusing on flexibility and posture correction.",
      specializations: ["Beginner Yoga", "Flexibility"],
      contact_email: "neha.flex@gmail.com",
      phone: "+91 9933011223",
      centers: [
        {
          name: "Flex Studio",
          address: "Powai, Mumbai, Maharashtra",
        },
      ],
    },
    {
      name: "Kunal Mehta",
      photo_url:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      bio: "Corporate yoga trainer specialising in desk posture and mobility.",
      specializations: ["Corporate Yoga", "Posture Correction"],
      contact_email: "kunal.officeyoga@gmail.com",
      phone: "+91 9870055443",
      centers: [
        {
          name: "Office Wellness Hub",
          address: "Lower Parel, Mumbai, Maharashtra",
        },
      ],
    },
    {
      name: "Pooja Nair",
      photo_url:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      bio: "Restorative yoga coach focusing on sleep improvement and relaxation.",
      specializations: ["Restorative Yoga", "Sleep Therapy"],
      contact_email: "pooja.sleep@gmail.com",
      phone: "+91 9810066778",
      centers: [
        {
          name: "Rest & Restore",
          address: "Viman Nagar, Pune, Maharashtra",
        },
      ],
    },
    {
      name: "Siddharth Rao",
      photo_url:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
      bio: "Traditional yoga teacher rooted in Indian yogic philosophy.",
      specializations: ["Traditional Yoga", "Yoga Philosophy"],
      contact_email: "sid.traditional@gmail.com",
      phone: "+91 9822233445",
      centers: [
        {
          name: "Sanatan Yoga Hall",
          address: "Shivaji Nagar, Pune, Maharashtra",
        },
      ],
    },
    {
      name: "Meera Kulkarni",
      photo_url:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      bio: "Women-centric yoga instructor specialising in hormonal balance and wellness.",
      specializations: ["Women's Wellness", "Hormonal Yoga"],
      contact_email: "meera.wellness@gmail.com",
      phone: "+91 9898981212",
      centers: [
        {
          name: "Sakhi Wellness Studio",
          address: "Aundh, Pune, Maharashtra",
        },
      ],
    },
  ];

  for (const ins of instructors) {
    for (const center of ins.centers) {
      const coords = await geocodeAddress(center.address);
      center.lat = coords.lat;
      center.lng = coords.lng;
    }
    await Instructor.create(ins);
  }

  console.log("✅ 9 instructors seeded successfully with auto-geocoding");
  process.exit();
}

seed();
