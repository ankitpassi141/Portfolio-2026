// All the editable text and photo slots for about.html ("Off the Clock" —
// the personal/hobbies page, not a work bio). Edit strings here; about.js
// reads this file and fills in the page. See reference/about-page.md for
// how the photo slots work and what to name each file.
//
// Every `photo` field below is a filename inside images/about/ — until
// that file exists, the card shows its `gradient` colors instead (a real
// CSS background, not a broken-image icon), so nothing looks broken while
// you're still collecting photos.
window.ABOUT = {
  // Browser tab title + search/share preview description.
  pageTitle: "About — Ankit Passi",
  pageDescription: "What Ankit Passi does outside work — hobbies, side projects, and a small bit of who he is.",

  // Small section labels shown above the bio, hobby cards, and tag cloud.
  bioKicker: "About me",
  hobbiesHeading: "what else I do",
  tagsLabel: "ANYTHING ELSE?",

  // Hero wordmark. "Ankit" (the first word) gets the hand-drawn underline
  // automatically — see the annotated-underline note in about.js.
  heroName: "Ankit Passi",

  hero: {
    photo: "hero-portrait.jpg",
    gradient: ["#9a6a3a", "#d1a568"]
  },

  // Short line under the hero, left of the thumbnails.
  belief: "What I do outside a job isn't a statement. It's a habit — pick a small thing, push at it until it's interesting, keep whatever survives.",

  // Longer line at the bottom of the hero's right column.
  mission: "This page exists because pushing at one small thing until it's interesting is a habit I never grew out of — some of it I'm good at, some of it, deliberately, I'm still bad at.",

  // 2x2 thumbnail grid next to the belief/mission text — no captions, no
  // labels, deliberately (see reference/about-page.md). Independent of the
  // hobby cards below, so these can be different photos if you want.
  thumbs: [
    { photo: "thumb-1.jpg", gradient: ["#4a5b7a", "#8ba0be"] },
    { photo: "thumb-2.jpg", gradient: ["#3f5949", "#6d9179"] },
    { photo: "thumb-3.jpg", gradient: ["#7a4a4a", "#b57878"] },
    { photo: "thumb-4.jpg", gradient: ["#75753f", "#a9a96b"] }
  ],

  // "About me" panel — bio paragraph (left) + quick facts (right).
  bio: "I'm Ankit. I live in Delhi, and there's a different side of me when I am not working. I like to keep my creativity high, and do whatever my mind and body tells me to! This page is that running list, not a highlight reel. Some of things I am good at! Some of it — harmonica, mostly — I am deliberately, currently, not.",
  facts: [
    { label: "Where you at?", value: "Delhi, IN" },
    { label: "Anything new?", value: "Harmonica & Reading" },
    { label: "Reading", value: "Mahagatha - 100 stories from Puranas" },
    { label: "Playing", value: "Assassin's Creed IV: Black Flag" }
  ],

  // "What I make instead" — the hobby cards. A card with a `video` field
  // plays that clip on hover (desktop, with sound) or opens a fullscreen
  // autoplay lightbox on tap (touch devices) — see
  // wireHoverVideo()/openLightbox() in about.js.
  hobbies: [
    { category: "Photography", title: "Virtual photography", photo: "hobby-1-photography.jpg", gradient: ["#4a5b7a", "#8ba0be"] },
    { category: "Hardware", title: "PC building", photo: "hobby-2-pc-building.jpg", gradient: ["#3f5949", "#6d9179"] },
    { category: "Craft", title: "DIY", photo: "hobby-3-handmade.jpg", gradient: ["#7a4a4a", "#b57878"] },
    { category: "Craft", title: "Wall painting", photo: "hobby-4-wall-painting.jpg", gradient: ["#9a6a3a", "#d1a568"] },
    { category: "Physical", title: "Football", photo: "hobby-6-football.jpg", gradient: ["#3f5f75", "#6b95af"] },
    { category: "Physical", title: "Running", photo: "hobby-7-running.jpg", gradient: ["#2f6b4f", "#63a084"] },
    { category: "Reading", title: "Currently reading", photo: "hobby-8-reading.jpg", gradient: ["#5f3f5f", "#8f6b8f"] },
    { category: "Learning", title: "Harmonica", photo: "hobby-5-harmonica.jpg", gradient: ["#75753f", "#a9a96b"], video: "hobby-5-harmonica.mp4" }
  ],

  // Q&A — question (mono, left) / answer (serif, right).
  qa: [
    { q: "What you do when you are not working?", a: "Gaming, I love to game as it allows me to explore different stories, perspectives and...it's fun!, Mostly on my PS5, and I like to do virtual photography inside each game I play. It's the same eye as anything else I do, just with no stakeholder in the room." },
    { q: "Wall painting, sketching, scrapbooking — same itch that you're drawn to, or different ones?", a: "I grew up learning to paint, sketch & draw - and now where people rarely even writes on paper, I find opportunities to create something with my own hand on a piece of paper or on canvas." },
    { q: "Marathons and football — discipline, competition, or something else?", a: "I am a sportsperson from beginning, exploring new ones or reigniting the old ones - anything that allows me to exhaust myself, and keep myself fit - Running and Football for me, goes hand-in-hand. and I'm actually play pretty decent! :D" },
    { q: "Ever experimented with a product until you'd basically redesigned it in your head?", a: "As a matter of fact, Yes, This portfolio. It's been my longest running project ever since beginning. Through it, I always tried new tools, skillsets, new philosophy. Every version I create, I already have another one going on in my head!" },
{ q: "What got you into photoshooting in games instead of just playing them?", a: "I firmly believe Video Games are pieces of Art. And it's a space that allows me to explore spaces & periods that I'll never be able to! And this allows me to experiment with Photography and learn and create something that most people would never be able to...right from my bedroom!" },
{ q: "Reader, writer, mythology buff — is there a thread connecting all three?", a: "Not a thread per se, Writing for me is again an activity that allows me to explore my mindspace without making it overwhelming. And right at the opposite side is the reading part, I read to make myself as a better storyteller. And Mythology bit - Religions (all of them) are just interesting, with so many interesting characters and their stories and I love to read & explore all of them and learning from each perspective." }
  ],

  // "Some More Interests" tag cloud — plain words/phrases, no photos.
  tags: ["Cafe Hopping", "Long Drives", "Making stuff with my own hands", "Badminton", "Swimming", "DIY", "Watching Murder Documentaries", "Collecting Figurines", "Doing Scrapbooking", "....and many more"],

  footer: {
    location: "Delhi· IN",
    email: "ankitpassi.design@gmail.com"
  }
};
