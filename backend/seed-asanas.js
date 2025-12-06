// seed-asanas.js
// Run: node seed-asanas.js
// Inserts 50 asanas into the "asanas" collection (clears existing ones first).
// Uses a curated list of YouTube links (short tutorials) and Option-3 tags.

const { MongoClient } = require('mongodb')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenflowdb'

const asanaNames = [
  "Tadasana (Mountain Pose)","Vrikshasana (Tree Pose)","Adho Mukha Svanasana (Downward Dog)",
  "Bhujangasana (Cobra Pose)","Balasana (Child's Pose)","Setu Bandha Sarvangasana (Bridge Pose)",
  "Ardha Matsyendrasana (Half Lord of the Fishes)","Trikonasana (Triangle Pose)","Virabhadrasana I (Warrior I)",
  "Virabhadrasana II (Warrior II)","Uttanasana (Standing Forward Bend)","Baddha Konasana (Bound Angle)",
  "Paschimottanasana (Seated Forward Bend)","Dhanurasana (Bow Pose)","Ustrasana (Camel Pose)",
  "Salamba Sarvangasana (Supported Shoulderstand)","Halasana (Plow Pose)","Navasana (Boat Pose)",
  "Marjaryasana-Bitilasana (Cat-Cow)","Ananda Balasana (Happy Baby)","Savasana (Corpse Pose)",
  "Gomukhasana (Cow Face Pose)","Utkatasana (Chair Pose)","Padmasana (Lotus Pose)",
  "Ardha Chandrasana (Half Moon)","Janu Sirsasana (Head-to-Knee Forward Bend)","Supta Baddha Konasana (Reclined Bound Angle)",
  "Prasarita Padottanasana (Wide-Legged Forward Bend)","Upavistha Konasana (Wide-Angle Seated Forward Bend)",
  "Parivrtta Trikonasana (Revolved Triangle)","Salabhasana (Locust Pose)","Viparita Karani (Legs-Up-The-Wall)",
  "Urdhva Mukha Svanasana (Upward-Facing Dog)","Tittibhasana (Firefly Pose)","Pincha Mayurasana (Forearm Balance)",
  "Bakasana (Crow Pose)","Natarajasana (Dancer Pose)","Chaturanga Dandasana (Four-Limbed Staff Pose)",
  "Ardha Uttanasana (Half Forward Fold)","Malasana (Garland Pose)","Krounchasana (Heron Pose)",
  "Kapalabhati Breath (Technique)","Bhramari (Bee Breath)","Anulom Vilom (Alternate Nostril Breath)",
  "Sukhasana (Easy Pose)","Vajrasana (Thunderbolt Pose)","Shirshasana (Headstand)"
]

// curated YouTube links (50). These are the links I provided earlier.
const youtubeLinks = {
  "Tadasana (Mountain Pose)": "https://youtu.be/9eNMoDT2I-k?si=ZDg6YOB1rzV4Q3tV",
  "Vrikshasana (Tree Pose)": "https://youtu.be/fIF016JROiA?si=MxqqDC3lq0RvBR9D",
  "Adho Mukha Svanasana (Downward Dog)": "https://youtu.be/ETSIv8WetjI?si=b2GItg5jA3og1W6n",
  "Bhujangasana (Cobra Pose)": "https://youtu.be/qp1jcVFbXuE?si=J5gcK0RcBkT7vHDc",
  "Balasana (Child's Pose)": "https://youtu.be/2MJGg-dUKh0?si=iOFW2JCUZ-r0jWp4",
  "Setu Bandha Sarvangasana (Bridge Pose)": "https://youtu.be/XUcAuYd7VU0?si=A-LKb7Lok56vGMTJ",
  "Ardha Matsyendrasana (Half Lord of the Fishes)": "https://youtu.be/kxgKSFI5cvg?si=JgEz9nfCqMeX9CUg",
  "Trikonasana (Triangle Pose)": "https://youtu.be/FSdVBFpT6i4?si=QbG2YRo6ePxQApXO",
  "Virabhadrasana I (Warrior I)": "https://youtu.be/kkGY3xBnaGc?si=SYtr0V5J-LRgwLvk",
  "Virabhadrasana II (Warrior II)": "https://youtu.be/yxNtoOJ9500?si=Yvps0lX5UPY0owFP",
  "Uttanasana (Standing Forward Bend)": "https://youtu.be/HXOxs7ADii8?si=HRxI6kJr7ktSwNpj",
  "Baddha Konasana (Bound Angle Pose)": "https://youtu.be/bCyk1sNm39k?si=S6UERUFjWy21gj_4",
  "Paschimottanasana (Seated Forward Bend)": "https://youtu.be/T8sgVyF4Ux4?si=mLefP_JvGrubmcG3",
  "Dhanurasana (Bow Pose)": "https://youtu.be/xm00XMmBbto?si=2t9Td01tJhxnr1r-",
  "Ustrasana (Camel Pose)": "https://youtu.be/vmYFqSk4JtY?si=mLVlkoXj4YXbYyxd",
  "Salamba Sarvangasana (Supported Shoulderstand)": "https://youtu.be/xJ0exoga2oc?si=Ib16G4dnOEzWYpt8",
  "Halasana (Plow Pose)": "https://youtu.be/zOZumZ_lD1c?si=GcyiutCkn7t5kaR8",
  "Navasana (Boat Pose)": "https://youtu.be/8KsyQvwi85Q?si=k01sG1-5yTBOa84c",
  "Marjaryasana-Bitilasana (Cat-Cow)": "https://youtu.be/vuyUwtHl694?si=f3OQ1NtmTxoT_aMB",
  "Ananda Balasana (Happy Baby)": "https://youtu.be/Ppku7i3ypGM?si=7C8X-MTGkoFEgdWp",
  "Savasana (Corpse Pose)": "https://youtu.be/dXYtWuYxWmQ?si=zg0qQDBLDffefHii",
  "Gomukhasana (Cow Face Pose)": "https://youtu.be/d_dh_DwDr84?si=IWqyVhm7JlshGFRN",
  "Utkatasana (Chair Pose)": "https://youtu.be/qQZOlIHMlmA?si=NX6fK-gomxPDpSp3",
  "Padmasana (Lotus Pose)": "https://youtu.be/7CcNJsdxdxQ?si=L-QEpYcQsZMFAYxQ",
  "Ardha Chandrasana (Half Moon)": "https://youtu.be/bgisz6FZXZ8?si=Urw6Itu1TeWQwDk1",
  "Janu Sirsasana (Head-to-Knee Forward Bend)": "https://youtu.be/TQKl8QFTH7s?si=IqX1OEG_Cq1hAxaC",
  "Supta Baddha Konasana (Reclined Bound Angle)": "https://youtu.be/dQkBuNWxZK4?si=OyvIGvWGegXfL3Hg",
  "Prasarita Padottanasana (Wide-Legged Forward Bend)": "https://youtu.be/U8mxpHyRlmo?si=aGR3wmF_nP-L8xN8",
  "Upavistha Konasana (Wide-Angle Seated Forward Bend)": "https://youtu.be/YtjKXDHd5hU?si=L13eWuMWXlqRqKpY",
  "Parivrtta Trikonasana (Revolved Triangle)": "https://youtu.be/IuwhGXTc2f0?si=TNfwomspxiWkjCmk",
  "Salabhasana (Locust Pose)": "https://youtu.be/qqdBKqe_WfI?si=CDJtwM_s9mEDq287",
  "Viparita Karani (Legs-Up-The-Wall)": "https://youtu.be/ZDC4VQQLD0U?si=XrLPimeRrV27GAZ6",
  "Urdhva Mukha Svanasana (Upward-Facing Dog)": "https://youtu.be/sdO9fY57nnk?si=f1O23MrBPq5kYqdL",
  "Tittibhasana (Firefly Pose)": "https://youtu.be/ClFVzbD9QAY?si=R-4KLRqCCzsIiOHl",
  "Pincha Mayurasana (Forearm Balance)": "https://youtube.com/shorts/kjU96VlmRr4?si=A3MEoM8tlLt9Nh_t",
  "Bakasana (Crow Pose)": "https://youtu.be/piToZuGFtsU?si=SjrgqwRzW03dIDbO",
  "Natarajasana (Dancer Pose)": "https://youtu.be/F0Yzhi8nMSA?si=Xm76HzpRPp0pIQif",
  "Chaturanga Dandasana (Four-Limbed Staff Pose)": "https://youtu.be/rTVWSjYAZ2Y?si=cx20IkR2lP_A06Wn",
  "Ardha Uttanasana (Half Forward Fold)": "https://youtu.be/2_yNresGBQE?si=urT63PPky5EiGsLV",
  "Malasana (Garland Pose)": "https://youtu.be/HnM6kfwhzd0?si=XHeoJ_CySYcf92od",
  "Krounchasana (Heron Pose)": "https://youtu.be/nU0_IlA8xhY?si=NGfqgGeFy3xK2oNt",
  "Kapalabhati Breath (Technique)": "https://youtu.be/MuBLwjmIUM8?si=NQmu1jWVjGLKkNQs",
  "Bhramari (Bee Breath)": "https://youtu.be/Zqbrw5FtdKg?si=alO8-ZXG8MjL34Lc",
  "Anulom Vilom (Alternate Nostril Breath)": "https://youtube.com/shorts/hcbm8czsHX4?si=7pdb4gICXSlFd87a",
  "Sukhasana (Easy Pose)": "https://youtu.be/ri9B8IzLXIY?si=UnMevulZZrDBfWCF",
  "Vajrasana (Thunderbolt Pose)": "https://youtu.be/82p0aGNJSF4?si=LR39dJEH6187jbrQ",
  "Shirshasana (Headstand)": "https://youtu.be/emb0xwvZ7HM?si=KJd9JqApSLQCFfE4"
}

// tag mapping (Option 3 mix) normalized to quick tags
const tagMapping = {
  "Tadasana (Mountain Pose)": ["general","focus"],
  "Vrikshasana (Tree Pose)": ["focus","balance"],
  "Adho Mukha Svanasana (Downward Dog)": ["energy","stress"],
  "Bhujangasana (Cobra Pose)": ["energy","depression"],
  "Balasana (Child's Pose)": ["stress","sleep","peaceful"],
  "Setu Bandha Sarvangasana (Bridge Pose)": ["energy","sleep"],
  "Ardha Matsyendrasana (Half Lord of the Fishes)": ["focus","peaceful"],
  "Trikonasana (Triangle Pose)": ["energy","focus"],
  "Virabhadrasana I (Warrior I)": ["energy","focus"],
  "Virabhadrasana II (Warrior II)": ["energy","focus"],
  "Uttanasana (Standing Forward Bend)": ["stress","peaceful"],
  "Baddha Konasana (Bound Angle Pose)": ["sleep","peaceful"],
  "Paschimottanasana (Seated Forward Bend)": ["stress","peaceful"],
  "Dhanurasana (Bow Pose)": ["energy","focus"],
  "Ustrasana (Camel Pose)": ["energy","depression"],
  "Salamba Sarvangasana (Supported Shoulderstand)": ["focus","energy"],
  "Halasana (Plow Pose)": ["sleep","peaceful"],
  "Navasana (Boat Pose)": ["focus","energy"],
  "Marjaryasana-Bitilasana (Cat-Cow)": ["stress","peaceful"],
  "Ananda Balasana (Happy Baby)": ["peaceful","sleep"],
  "Savasana (Corpse Pose)": ["peaceful","sleep"],
  "Gomukhasana (Cow Face Pose)": ["peaceful","focus"],
  "Utkatasana (Chair Pose)": ["energy","focus"],
  "Padmasana (Lotus Pose)": ["focus","peaceful"],
  "Ardha Chandrasana (Half Moon)": ["focus","balance"],
  "Janu Sirsasana (Head-to-Knee Forward Bend)": ["peaceful","stress"],
  "Supta Baddha Konasana (Reclined Bound Angle)": ["sleep","peaceful"],
  "Prasarita Padottanasana (Wide-Legged Forward Bend)": ["flexibility","stress"],
  "Upavistha Konasana (Wide-Angle Seated Forward Bend)": ["flexibility","peaceful"],
  "Parivrtta Trikonasana (Revolved Triangle)": ["focus","energy"],
  "Salabhasana (Locust Pose)": ["energy","focus"],
  "Viparita Karani (Legs-Up-The-Wall)": ["sleep","peaceful"],
  "Urdhva Mukha Svanasana (Upward-Facing Dog)": ["energy","flexibility"],
  "Tittibhasana (Firefly Pose)": ["strength","focus"],
  "Pincha Mayurasana (Forearm Balance)": ["balance","focus"],
  "Bakasana (Crow Pose)": ["balance","focus"],
  "Natarajasana (Dancer Pose)": ["balance","energy"],
  "Chaturanga Dandasana (Four-Limbed Staff Pose)": ["strength","energy"],
  "Ardha Uttanasana (Half Forward Fold)": ["flexibility","peaceful"],
  "Malasana (Garland Pose)": ["flexibility","peaceful"],
  "Krounchasana (Heron Pose)": ["flexibility","focus"],
  "Kapalabhati Breath (Technique)": ["energy","focus"],
  "Bhramari (Bee Breath)": ["stress","peaceful"],
  "Anulom Vilom (Alternate Nostril Breath)": ["sleep","peaceful"],
  "Sukhasana (Easy Pose)": ["peaceful","focus"],
  "Vajrasana (Thunderbolt Pose)": ["peaceful","focus"],
  "Shirshasana (Headstand)": ["balance","focus","energy"]
}

function normalizeTags(arr){
  if(!Array.isArray(arr)) return ['general']
  return Array.from(new Set(arr.map(t=>{
    const lower = String(t).toLowerCase()
    if(lower.includes('sleep')) return 'sleep'
    if(lower.includes('stress') || lower.includes('relax') || lower.includes('calm')) return 'stress'
    if(lower.includes('energy') || lower.includes('vitality')) return 'energy'
    if(lower.includes('focus') || lower.includes('balance')) return 'focus'
    if(lower.includes('depress') || lower.includes('mood')) return 'depression'
    if(lower.includes('peace')) return 'peaceful'
    return 'general'
  })))
}

function getTagsFor(name){
  const t = tagMapping[name]
  if(Array.isArray(t)) return normalizeTags(t)
  return ['general']
}

async function main(){
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db()
    const coll = db.collection('asanas')

    console.log('Clearing existing asanas collection (if any)...')
    await coll.deleteMany({})

    const docs = asanaNames.map((nm, i) => ({
      name: nm,
      description: `${nm} — gentle practice to improve flexibility and well-being. Practice mindfully.`,
      tags: getTagsFor(nm).join(' '), // convert to single string for text index compatibility
      photo_url: 'nm.jpg',
      youtube_url: youtubeLinks[nm] || null,
      created_at: new Date()
    }))

    const res = await coll.insertMany(docs)
    console.log('Inserted', res.insertedCount, 'asanas.')
    console.log('Done. Put images in frontend/public/assets/ named asana_1.jpg ... asana_50.jpg or modify photo_url fields.')
  } catch (err){
    console.error('Error seeding asanas:', err)
  } finally {
    await client.close()
  }
}

main()
