// seed-asanas.js
// Run: node seed-asanas.js
// Inserts 50 asanas into the "asanas" collection (clears existing ones first).
// photo_url is set to the exact asana name + ".jpg" so filenames must exactly match.
// Adds a pose-specific `message` field and `tags_array`. Keeps `tags` string for text index.

const { MongoClient } = require('mongodb')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenflowdb'

const asanaNames = [
  "Tadasana (Mountain Pose)","Vrikshasana (Tree Pose)","Adho Mukha Svanasana (Downward Dog)",
  "Bhujangasana (Cobra Pose)","Balasana (Child's Pose)","Setu Bandha Sarvangasana (Bridge Pose)",
  "Ardha Matsyendrasana (Half Lord of the Fishes)","Trikonasana (Triangle Pose)","Virabhadrasana I (Warrior I)",
  "Virabhadrasana II (Warrior II)","Uttanasana (Standing Forward Bend)","Baddha Konasana (Bound Angle Pose)",
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

// curated YouTube links (copied from your input)
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

// tag mapping (copied from your input)
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
    if(lower.includes('flexibility')) return 'flexibility'
    if(lower.includes('strength')) return 'strength'
    return 'general'
  })))
}

function getTagsFor(name){
  const t = tagMapping[name]
  if(Array.isArray(t)) return normalizeTags(t)
  return ['general']
}

// pose-specific messages mapping (one entry per asana)
const messages = {
  "Tadasana (Mountain Pose)": "Tadasana builds a steady foundation — stand tall, root through your feet and lengthen the spine. Use it to check alignment and establish mindful breathing.",
  "Vrikshasana (Tree Pose)": "Vrikshasana improves balance and focus. Ground one foot, press through the standing leg and lift through the chest to cultivate steadiness.",
  "Adho Mukha Svanasana (Downward Dog)": "Downward Dog stretches the entire back line and energizes the body. Press hips up and back while breathing smoothly for spine length.",
  "Bhujangasana (Cobra Pose)": "Bhujangasana gently opens the chest and strengthens the back. Use as a mild backbend — lift with the upper back, not the neck.",
  "Balasana (Child's Pose)": "Balasana is a restful forward fold; relax the forehead to the mat and breathe deeply to relieve tension and calm the nervous system.",
  "Setu Bandha Sarvangasana (Bridge Pose)": "Bridge strengthens the glutes and gently opens the chest. Press through feet and lift hips while keeping a long neck.",
  "Ardha Matsyendrasana (Half Lord of the Fishes)": "A seated twist to improve spinal mobility and aid digestion. Sit tall, rotate from the thoracic spine and breathe into the twist.",
  "Trikonasana (Triangle Pose)": "Triangle pose lengthens the sides of the body and improves balance. Keep both legs strong and reach through the crown for length.",
  "Virabhadrasana I (Warrior I)": "Warrior I builds strength and focus — front knee over ankle, back leg active, lift the arms for an energizing standing posture.",
  "Virabhadrasana II (Warrior II)": "Warrior II stabilizes and opens the hips; broaden the collarbones and gaze over the front hand to cultivate stamina.",
  "Uttanasana (Standing Forward Bend)": "Uttanasana releases the hamstrings and soothes the nervous system — fold from the hips and soften the neck.",
  "Baddha Konasana (Bound Angle Pose)": "Bound Angle gently opens the inner thighs and hips; sit tall and lean forward only as far as comfortable.",
  "Paschimottanasana (Seated Forward Bend)": "Seated forward fold stretches the back of the body and calms the mind — hinge at the hips and breathe into the stretch.",
  "Dhanurasana (Bow Pose)": "Bow pose opens the chest and strengthens the back and legs — lift through the sternum while keeping the neck long.",
  "Ustrasana (Camel Pose)": "Camel is a heart-opening backbend; support the lower back with engagement and avoid compressing the neck.",
  "Salamba Sarvangasana (Supported Shoulderstand)": "Supported shoulderstand encourages circulation and calm — use core support and avoid if you have neck issues without guidance.",
  "Halasana (Plow Pose)": "Plow pose deeply stretches the back and shoulders — move slowly, keep the neck long, and exit carefully.",
  "Navasana (Boat Pose)": "Boat builds core strength and balance; keep the spine long and lift the chest to maintain steady breath.",
  "Marjaryasana-Bitilasana (Cat-Cow)": "Cat-Cow mobilizes the spine and warms the body; synchronize movement with breath for full benefit.",
  "Ananda Balasana (Happy Baby)": "Happy Baby gently opens the hips and provides a playful stretch; hold the feet and draw knees toward the armpits.",
  "Savasana (Corpse Pose)": "Savasana is deep restorative rest — lie still, soften the breath, and allow the body to integrate the practice.",
  "Gomukhasana (Cow Face Pose)": "Cow Face opens shoulders and hips; work within a comfortable range and use a strap if the hands can't meet.",
  "Utkatasana (Chair Pose)": "Chair pose strengthens the legs and core while building heat — sit back into an imaginary chair and lift through the chest.",
  "Padmasana (Lotus Pose)": "Lotus supports meditative posture and hip opening — approach gradually and use variations if knees feel sensitive.",
  "Ardha Chandrasana (Half Moon)": "Half Moon improves balance and side-body strength; keep a soft micro-bend in the standing leg and lift through the torso.",
  "Janu Sirsasana (Head-to-Knee Forward Bend)": "A calming seated stretch for the hamstring and back; hinge from the hip and breathe into the release.",
  "Supta Baddha Konasana (Reclined Bound Angle)": "Reclined bound angle is restful and opens the hips; support the knees with props and relax the belly.",
  "Prasarita Padottanasana (Wide-Legged Forward Bend)": "Wide-legged fold lengthens the spine and hamstrings; anchor the feet and fold with a long spine.",
  "Upavistha Konasana (Wide-Angle Seated Forward Bend)": "Wide-angle forward bend stretches the inner legs and back; move slowly and keep the breath even.",
  "Parivrtta Trikonasana (Revolved Triangle)": "Revolved triangle is a twisting standing pose that strengthens and detoxifies; rotate from the torso, not the neck.",
  "Salabhasana (Locust Pose)": "Locust strengthens the back body and supports posture — lift with the upper back and glutes while breathing steadily.",
  "Viparita Karani (Legs-Up-The-Wall)": "Legs-up-the-wall restores circulation and calms the mind — lie with hips close to the wall and relax for several minutes.",
  "Urdhva Mukha Svanasana (Upward-Facing Dog)": "Upward dog opens the chest and strengthens arms and spine; press through hands and roll the shoulders back.",
  "Tittibhasana (Firefly Pose)": "Firefly is an advanced arm balance that challenges strength and flexibility — warm up hips and hamstrings thoroughly first.",
  "Pincha Mayurasana (Forearm Balance)": "Forearm balance improves shoulder strength and balance; practice near a wall until comfortable holding the pose.",
  "Bakasana (Crow Pose)": "Crow builds arm strength and confidence — engage the core and find a steady gaze to balance.",
  "Natarajasana (Dancer Pose)": "Dancer improves balance, backbend and hip flexibility; keep weight in the standing foot and lift from the chest.",
  "Chaturanga Dandasana (Four-Limbed Staff Pose)": "Chaturanga strengthens the core, arms and shoulders — maintain a straight line from head to heels with control.",
  "Ardha Uttanasana (Half Forward Fold)": "Half forward fold lengthens the spine and prepares deeper forward folds — keep the back flat and chest open.",
  "Malasana (Garland Pose)": "Garland pose opens the hips and groin while strengthening the legs — keep the spine long and chest lifted.",
  "Krounchasana (Heron Pose)": "Heron stretches the hamstrings deeply in a seated posture; support the knee if needed and maintain even breath.",
  "Kapalabhati Breath (Technique)": "Kapalabhati is a cleansing breath that invigorates the body — use short, forceful exhalations with passive inhalations.",
  "Bhramari (Bee Breath)": "Bhramari calms the nervous system by producing soothing vibrations — cover the ears and hum on exhale for several rounds.",
  "Anulom Vilom (Alternate Nostril Breath)": "Alternate nostril breathing balances the hemispheres and prepares the mind for practice; keep breaths gentle and even.",
  "Sukhasana (Easy Pose)": "Easy pose is a simple seated posture for breathwork and meditation — sit tall, relax the shoulders and soften the gaze.",
  "Vajrasana (Thunderbolt Pose)": "Vajrasana is a grounding seated pose ideal after meals or for meditation; keep the spine upright and breathe slowly.",
  "Shirshasana (Headstand)": "Headstand increases circulation and builds core stability — practice only with preparation and avoid with neck or blood pressure issues."
}

// Keep getTagsFor / normalizeTags from earlier to compute tags
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
    if(lower.includes('flexibility')) return 'flexibility'
    if(lower.includes('strength')) return 'strength'
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

    const docs = asanaNames.map((nm) => {
      const tagsArr = getTagsFor(nm)
      return {
        name: nm,
        description: `${nm} — gentle practice to improve flexibility and well-being. Practice mindfully.`,
        message: messages[nm] || `${nm} — practice mindfully and honor your limits.`,
        tags: tagsArr.join(' '), // single string for text index
        tags_array: tagsArr,
        // photo_url exactly matches the asana name + .jpg
        photo_url: `${nm}.jpg`,
        youtube_url: youtubeLinks[nm] || null,
        created_at: new Date()
      }
    })

    const res = await coll.insertMany(docs)
    console.log('Inserted', res.insertedCount, 'asanas.')
    console.log('Done. Ensure image files are present and named exactly as the asana names + ".jpg".')
  } catch (err){
    console.error('Error seeding asanas:', err)
  } finally {
    await client.close()
  }
}

main()
