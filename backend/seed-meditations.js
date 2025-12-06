// seed-meditations.js
// Run: node seed-meditations.js
// Inserts 25 meditations into the "meditations" collection (clears existing ones first).
// photo_url is set to the exact meditation name + ".jpg" so filenames must exactly match.
// Adds pose-specific `message`, `tags_array`. Keeps `tags` string for text index.

const { MongoClient } = require('mongodb')

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenflowdb'

const meditationNames = [
  "Mindful Breath (5-minute)",
  "Body Scan (10-minute)",
  "Guided Sleep (30-minute)",
  "Loving-Kindness (Metta)",
  "Grounding Visualization",
  "Box Breathing (4-4-4-4)",
  "4-7-8 Relaxation",
  "Progressive Muscle Relaxation",
  "Breath Awareness (10-minute)",
  "Walking Meditation (10-minute)",
  "Mindful Eating Intro",
  "Stress Release Quick (5-minute)",
  "Anxiety Soother",
  "Focus Booster (Concentration)",
  "Chakra Soothing (Short)",
  "Gratitude Practice",
  "Acceptance & Letting Go",
  "Inner Calm (Guided)",
  "Compassion Meditation",
  "Visualization for Energy",
  " Breath Counting (Beginner)",
  "Nature Sound Guided",
  "Morning Energizer (10-minute)",
  "Evening Wind-Down (15-minute)",
  "Mantra Repetition (Short)"
]

// curated YouTube links — these are placeholders you can replace with your chosen links
const youtubeLinks = {
  "Mindful Breath (5-minute)": "https://youtu.be/I-SFdhVwrVA?si=BnhlrWvmcmh9YI0k",
  "Body Scan (10-minute)": "https://youtu.be/nnVCadMo3qI?si=8bvXqEY3FcL5pZ5r", // replace with actual
  "Guided Sleep (30-minute)": "https://youtu.be/jLcww-nIXcw?si=zkMUsr_GWMCXAETa",
  "Loving-Kindness (Metta)": "https://youtu.be/sDi40FQcaIU?si=23TopgJe0XZsYCvt",
  "Grounding Visualization": "https://youtu.be/8vFZ-cF4ioI?si=jNPIYDZM6GMh-W5e",
  "Box Breathing (4-4-4-4)": "https://youtu.be/Rt08wzTYKHg?si=c3yYB5i4MBpP5Tft",
  "4-7-8 Relaxation": "https://youtu.be/LiUnFJ8P4gM?si=Z1gUPLQ07BTh3bQO",
  "Progressive Muscle Relaxation": "https://youtu.be/86HUcX8ZtAk?si=XSajvGYvWJDAx8Ob",
  "Breath Awareness (10-minute)": "https://youtu.be/VUjiXcfKBn8?si=zWree8BWCqro6BuY",
  "Walking Meditation (10-minute)": "https://youtu.be/uzOh2ZZp3dg?si=g1UCe3d2TY2333BZ",
  "Mindful Eating Intro": "https://youtube.com/shorts/TR13jFId0ow?si=UZYKBD5n6PBiypg3",
  "Stress Release Quick (5-minute)": "https://youtu.be/Ix73CLI0Mo0?si=Pf0e4gcgnTtPUPIE",
  "Anxiety Soother": "https://youtu.be/YzRUEmqDJd8?si=cgJpJ8sQtr_IY1mr",
  "Focus Booster (Concentration)": "https://youtu.be/ausxoXBrmWs?si=MYqjj99TCL1uWSCK",
  "Chakra Soothing (Short)": "https://youtu.be/dui53JxByeI?si=5bgjb3G4Q4iRqhgL",
  "Gratitude Practice": "https://youtu.be/OCorElLKFQE?si=zZco5MMGm20u_V77",
  "Acceptance & Letting Go": "https://youtu.be/3YuOMmxbc9M?si=IKLMi2si9EElP_5m",
  "Inner Calm (Guided)": "https://youtu.be/fiXwUZpj5Xg?si=WLfzfL3t1QzNWU0q",
  "Compassion Meditation": "https://youtu.be/-d_AA9H4z9U?si=80M5M7btlMwkFWbW",
  "Visualization for Energy": "https://youtu.be/NVPrxcR_RZI?si=syGPkRk6woJxoTJx",
  " Breath Counting (Beginner)": "https://youtu.be/yEhnKGG5hjY?si=Deu_PxRmECsroKx4",
  "Nature Sound Guided": "https://youtu.be/RPrCkVO0KJI?si=ff4N6_E5rVqRY3Fw",
  "Morning Energizer (10-minute)": "https://youtu.be/DaHH--jJBtg?si=cUb6KAHL1QxGPedM",
  "Evening Wind-Down (15-minute)": "https://youtu.be/BiWDsfZ3zbo?si=4ksLbB-R5DbreHFf",
  "Mantra Repetition (Short)": "https://youtu.be/8gyTxsQjdaQ?si=Bn785wE156A8HRHC"
}

// tag mapping for meditations (normalize to your quick tags: sleep, stress, energy, depression, peaceful, focus)
const tagMapping = {
  "Mindful Breath (5-minute)": ["focus","stress"],
  "Body Scan (10-minute)": ["sleep","peaceful"],
  "Guided Sleep (30-minute)": ["sleep","peaceful"],
  "Loving-Kindness (Metta)": ["peaceful","depression"],
  "Grounding Visualization": ["stress","peaceful"],
  "Box Breathing (4-4-4-4)": ["focus","stress"],
  "4-7-8 Relaxation": ["sleep","stress"],
  "Progressive Muscle Relaxation": ["sleep","stress"],
  "Breath Awareness (10-minute)": ["focus","peaceful"],
  "Walking Meditation (10-minute)": ["focus","peaceful"],
  "Mindful Eating Intro": ["focus","peaceful"],
  "Stress Release Quick (5-minute)": ["stress"],
  "Anxiety Soother": ["stress","depression"],
  "Focus Booster (Concentration)": ["focus","energy"],
  "Chakra Soothing (Short)": ["peaceful","focus"],
  "Gratitude Practice": ["peaceful","focus"],
  "Acceptance & Letting Go": ["peaceful","stress"],
  "Inner Calm (Guided)": ["peaceful","stress"],
  "Compassion Meditation": ["peaceful","depression"],
  "Visualization for Energy": ["energy","focus"],
  " Breath Counting (Beginner)": ["focus"],
  "Nature Sound Guided": ["peaceful","sleep"],
  "Morning Energizer (10-minute)": ["energy","focus"],
  "Evening Wind-Down (15-minute)": ["sleep","peaceful"],
  "Mantra Repetition (Short)": ["focus","peaceful"]
}

function normalizeTags(arr){
  if(!Array.isArray(arr)) return ['general']
  return Array.from(new Set(arr.map(t=>{
    const lower = String(t).toLowerCase()
    if(lower.includes('sleep')) return 'sleep'
    if(lower.includes('stress') || lower.includes('relax') || lower.includes('calm')) return 'stress'
    if(lower.includes('energy') || lower.includes('vitality')) return 'energy'
    if(lower.includes('focus') || lower.includes('balance') || lower.includes('concentration')) return 'focus'
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

// meditation-specific short messages mapping
const messages = {
  "Mindful Breath (5-minute)": "Quick breath practice to center attention. Gently follow the inhale and exhale to calm the mind and re-ground.",
  "Body Scan (10-minute)": "Progressive attention from toes to head — notice sensations without judgment; great for relaxation before sleep.",
  "Guided Sleep (30-minute)": "Full guided sleep practice with gentle voice and long pauses to help the body drift into restorative rest.",
  "Loving-Kindness (Metta)": "Cultivates goodwill toward self and others using short repeated phrases to open the heart and reduce isolation.",
  "Grounding Visualization": "Root into the present with earth-based imagery — imagine strong roots and steady breath to feel grounded and safe.",
  "Box Breathing (4-4-4-4)": "Structured breath for instant calm — inhale 4, hold 4, exhale 4, hold 4. Repeat to steady nervous system.",
  "4-7-8 Relaxation": "Breathing ratio to reduce anxiety and prepare for sleep — inhale 4, hold 7, exhale 8 with soft, relaxed lungs.",
  "Progressive Muscle Relaxation": "Systematically tense and relax muscle groups to release physical tension and invite restful ease.",
  "Breath Awareness (10-minute)": "Simple breath observation to develop concentration — notice the sensations at the nostrils and let thoughts pass.",
  "Walking Meditation (10-minute)": "Mindful walking practice focusing on each footstep and the sensations of movement; useful when sitting is hard.",
  "Mindful Eating Intro": "Slow, attentive tasting of a single bite — notice textures, flavors and how the body responds to savoring food.",
  "Stress Release Quick (5-minute)": "Short micro-practice to lower stress: take slow diaphragmatic breaths and soften the shoulders for several rounds.",
  "Anxiety Soother": "Gentle guidance for acute anxiety — anchor on breath and body sensations to reduce spiraling thoughts.",
  "Focus Booster (Concentration)": "Training attention with short sustained focus periods — ideal before study or work sessions.",
  "Chakra Soothing (Short)": "Brief guided rotation of awareness through the chakra centers for subtle balancing and calm.",
  "Gratitude Practice": "Short reflective practice listing small things you’re grateful for to uplift mood and widen perspective.",
  "Acceptance & Letting Go": "Guided acceptance exercise to acknowledge feelings without clinging and practice releasing what you cannot change.",
  "Inner Calm (Guided)": "Soft voice-led practice to create a quiet inner space through breath and gentle imagery.",
  "Compassion Meditation": "Invites compassionate phrases toward self and others to reduce harsh self-judgment and cultivate kindness.",
  "Visualization for Energy": "Uplifting guided imagery to renew vitality — imagine warmth and light energizing the body.",
  " Breath Counting (Beginner)": "Counting the breath builds focus: inhale count 1, exhale 1, up to 10 and repeat as attention returns.",
  "Nature Sound Guided": "Immersive practice using nature sounds to relax; ideal for those who calm quickly with ambient audio.",
  "Morning Energizer (10-minute)": "Short active meditation to wake up the body and sharpen the mind for the day ahead.",
  "Evening Wind-Down (15-minute)": "Gentle sequence of breath and body awareness to transition from busy day to restful evening.",
  "Mantra Repetition (Short)": "Silently repeat a simple phrase or sound to steady the mind and provide an anchor for attention."
}

async function main(){
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  try {
    await client.connect()
    const db = client.db()
    const coll = db.collection('meditations')

    console.log('Clearing existing meditations collection (if any)...')
    await coll.deleteMany({})

    const docs = meditationNames.map((nm) => {
      const tagsArr = getTagsFor(nm)
      return {
        name: nm,
        description: `${nm} — guided practice to support mindfulness and well-being.`,
        message: messages[nm] || `${nm} — practice mindfully and honor your limits.`,
        tags: tagsArr.join(' '),
        tags_array: tagsArr,
        photo_url: `${nm}.jpg`, // exact filename must match
        youtube_url: youtubeLinks[nm] || null,
        created_at: new Date()
      }
    })

    const res = await coll.insertMany(docs)
    console.log('Inserted', res.insertedCount, 'meditations.')
    console.log('Done. Ensure image files are present and named exactly as the meditation names + ".jpg".')
  } catch (err){
    console.error('Error seeding meditations:', err)
  } finally {
    await client.close()
  }
}

main()
