import { Category, Post, PageContent, SiteSettings, AdminUser } from '../src/types';

export const initialCategories: Category[] = [
  {
    id: 'cat-paper',
    slug: 'paper-crafts',
    name: 'Paper Crafts',
    description: 'Origami, crepe paper florals, card making, papier-mâché, and creative paper sculpting projects.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    iconName: 'Scissors',
    order: 1
  },
  {
    id: 'cat-home',
    slug: 'home-decor',
    name: 'Home Decor',
    description: 'Cozy, modern, and bohemian handmade home accents to elevate your living spaces on a budget.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    iconName: 'Home',
    order: 2
  },
  {
    id: 'cat-kids',
    slug: 'kids-crafts',
    name: 'Kids Crafts',
    description: 'Fun, safe, and engaging sensory craft activities designed for little hands and creative minds.',
    imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles',
    order: 3
  },
  {
    id: 'cat-gifts',
    slug: 'handmade-gifts',
    name: 'Handmade Gifts',
    description: 'Heartfelt personalized gifts, customized tags, gift wrapping, and thoughtful keepsakes.',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    iconName: 'Gift',
    order: 4
  },
  {
    id: 'cat-recycling',
    slug: 'recycling-crafts',
    name: 'Recycling Crafts',
    description: 'Sustainable upcycling hacks turning cardboard, tin cans, glass bottles, and scrap fabric into treasures.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    iconName: 'Recycle',
    order: 5
  },
  {
    id: 'cat-wallart',
    slug: 'wall-art',
    name: 'Wall Art',
    description: 'DIY canvas textures, framed botanical art, hanging yarn tapestries, and gallery wall statements.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    iconName: 'Palette',
    order: 6
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post-crepe-paper-peony',
    slug: 'how-to-make-3d-crepe-paper-peonies',
    title: 'How to Make 3D Crepe Paper Peony Flowers: A Step-by-Step Guide',
    excerpt: 'Transform simple Italian crepe paper into breathtaking, realistic blooming peonies with this beginner-friendly 6-step tutorial.',
    introduction: 'Peonies are beloved for their lush, ruffled petals and romantic presence, but their fresh blooming season is notoriously brief. In this comprehensive craft tutorial, we show you how to recreate nature’s masterpiece using heavy crepe paper, floral wire, and simple shaping techniques. These realistic paper blossoms last for years, making them ideal for wedding decor, bedside vase arrangements, or heartfelt handmade gifts!',
    categoryId: 'cat-paper',
    categoryName: 'Paper Crafts',
    tags: ['Paper Flowers', 'Crepe Paper', 'Floral DIY', 'Home Decor', 'Table Centerpiece'],
    featuredImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    materials: [
      { id: 'm1', name: '180g Heavy Italian Crepe Paper (Soft Pink & Olive Green)', amount: '2 rolls' },
      { id: 'm2', name: '18-Gauge Green Floral Stem Wire', amount: '6 pieces' },
      { id: 'm3', name: 'Floral Tape (Olive Green)', amount: '1 roll' },
      { id: 'm4', name: 'Precision Craft Scissors or Detail Snips', amount: '1 pair' },
      { id: 'm5', name: 'Low-Temperature Hot Glue Gun & Glue Sticks', amount: '1 set' },
      { id: 'm6', name: 'Polystyrene Craft Ball (25mm) for Flower Center', amount: '1 piece' },
      { id: 'm7', name: 'Soft Pastel Chalk or Watercolor for Petal Shading', amount: 'Optional' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    difficulty: 'Medium',
    timeNeeded: '45 mins',
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        title: 'Cut the Petals in Graded Sizes',
        description: 'Begin by cutting the crepe paper along the grain. You will need 3 distinct petal sizes: 10 small inner teardrop petals (approx. 3x5 cm), 12 medium heart-shaped petals (4x7 cm), and 14 large outer ruffled petals (5x8 cm). Keeping the paper grain vertical is essential so the petals can stretch and cup smoothly.',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
        tips: 'Stack 4-5 layers of crepe paper and cut simultaneously using a cardboard template to save time.'
      },
      {
        id: 's2',
        stepNumber: 2,
        title: 'Cup and Flute Each Individual Petal',
        description: 'Using both thumbs, gently press into the center of each petal while pulling outward to form a natural bowl shape. Next, use the smooth barrel of a wooden skewer or pen to gently curl the top edge backward. This gives the petals the organic, dynamic wave characteristic of blooming peonies.',
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
        tips: 'Be gentle with the paper grain; heavy 180g paper stretches up to 250%, so start with light thumb pressure.'
      },
      {
        id: 's3',
        stepNumber: 3,
        title: 'Construct the Floral Core and Stamen',
        description: 'Secure your 25mm foam ball onto the bent tip of an 18-gauge floral wire with a dollop of hot glue. Wrap a small square of crepe paper around the ball to conceal it, tightly twisting the base around the wire. Glue thin fringed yellow stamen paper around the perimeter if you desire an open peony look.',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        tips: 'Bend the top 1 cm of your floral wire into a small hook before inserting it into the styrofoam core to prevent wobbling.'
      },
      {
        id: 's4',
        stepNumber: 4,
        title: 'Attach the Inner and Middle Petal Layers',
        description: 'Apply a small dot of hot glue to the base of each small petal. Overlap the 10 small petals snugly around the core in a spiral arrangement. Once the inner bud is enclosed, affix the medium petals, rotating each petal slightly so the joins are hidden. Keep the bases aligned at the exact same height.',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
        tips: 'Rotate the stem in your hands as you glue each layer to ensure a symmetrical, spherical bloom.'
      },
      {
        id: 's5',
        stepNumber: 5,
        title: 'Attach Outer Petals and Build the Calyx',
        description: 'Glue the final layer of large outer petals around the lower base, angling them slightly outward to mimic a fully open peony blossom. Cut 5 pointed sepals from the olive green crepe paper and glue them beneath the flower head to conceal all exposed petal bases cleanly.',
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
        tips: 'Gently pinch the base of each green sepal while the glue cools to form a realistic tapered stem junction.'
      },
      {
        id: 's6',
        stepNumber: 6,
        title: 'Wrap the Stem and Shape Foliage',
        description: 'Beginning at the calyx, stretch your floral tape to activate its adhesive and wrap it firmly down the length of the wire stem. Incorporate 2-3 green crepe paper leaves along the lower third of the stem. Gently tease and fluff the petals with your fingers to finalize the bloom!',
        imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=900&q=80',
        tips: 'A light dusting of pink pastel chalk on the ruffled edges gives an ultra-realistic botanical finish.'
      }
    ],
    finalLookImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    closingTips: 'Display your finished crepe paper peonies in an opaque ceramic vase or vintage amber glass bottle away from direct sunlight and humidity. Spray with a high-grade UV protectant sealant spray if you plan to keep them as permanent room decor.',
    seoTitle: 'DIY 3D Crepe Paper Peonies Tutorial | CraftNest Step-by-Step Guide',
    seoDescription: 'Learn how to create realistic, blooming 3D crepe paper peonies with this 6-step DIY craft guide. Includes materials list, photos, and shaping tips.',
    focusKeyword: 'crepe paper peonies',
    ogImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    views: 1420,
    readingTimeMinutes: 6
  },
  {
    id: 'post-macrame-feather-wall',
    slug: 'diy-boho-macrame-feather-wall-hanging',
    title: 'DIY Boho Macramé Feather Wall Hanging with Natural Driftwood',
    excerpt: 'Bring relaxed bohemian texture to any blank wall with this easy macramé feather hanging made with combed cotton cord and salvaged branch driftwood.',
    introduction: 'Macramé continues to be one of the most rewarding home decor crafts because it requires no needles, no complex machinery, and very little setup space. In this tutorial, you will master the lark’s head knot and fringe brushing technique to create a gallery-worthy feather wall hanging mounted on organic driftwood.',
    categoryId: 'cat-home',
    categoryName: 'Home Decor',
    tags: ['Macramé', 'Boho Decor', 'Driftwood', 'Fiber Art', 'Wall Hanging'],
    featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    materials: [
      { id: 'm1', name: '4mm Single Twist Natural Cotton Cord (Ecru or Terracotta)', amount: '50 meters' },
      { id: 'm2', name: 'Cleaned Driftwood Branch or Wooden Dowel (40cm)', amount: '1 piece' },
      { id: 'm3', name: 'Fine-Toothed Metal Pet Slicker Brush or Comb', amount: '1 piece' },
      { id: 'm4', name: 'Heavy-Duty Fabric Shears', amount: '1 pair' },
      { id: 'm5', name: 'Fabric Stiffener Spray or Ultra-Hold Hair Spray', amount: '1 bottle' },
      { id: 'm6', name: 'Measuring Tape & Masking Tape', amount: '1 set' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    difficulty: 'Easy',
    timeNeeded: '35 mins',
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        title: 'Prepare Driftwood and Cut Core Spine Cords',
        description: 'Sand any rough splinters from your driftwood branch. For each feather, cut one central spine cord measuring 60 cm. Fold this cord in half and attach it to your branch using a classic Lark’s Head knot: loop the fold over the wood, pull the two tails through the loop, and cinch tight.',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
        tips: 'Wipe down coastal driftwood with diluted tea tree oil and let dry thoroughly before knotting.'
      },
      {
        id: 's2',
        stepNumber: 2,
        title: 'Cut Fringe Strips in Bulk',
        description: 'For each feather, you will need approximately 24 to 30 individual horizontal fringe pieces cut to 18 cm each. To speed this up, wrap your cotton cord around an 18 cm strip of stiff cardboard multiple times, then slice along one edge with sharp shears.',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
        tips: 'Cutting all fringe segments at once keeps your knotting rhythm uninterrupted.'
      },
      {
        id: 's3',
        stepNumber: 3,
        title: 'Knot the Alternating Feather Ribs',
        description: 'Take two folded 18 cm cords. Slide the loop of the first under the central spine from the left. Slide the loop of the second over the spine from the right. Thread the tails of each cord through the opposite loop and pull the tails in opposite directions horizontally to lock into place.',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
        tips: 'Alternate the starting side for each knot tier so your center spine maintains a uniform ribbed spine line.'
      },
      {
        id: 's4',
        stepNumber: 4,
        title: 'Comb Out the Cotton Fibers',
        description: 'Lay the knotted piece flat on a clean cutting board. Using a fine-toothed metal wire brush (a pet slicker brush works wonders), gently stroke outward from the spine to untwist the single-strand cotton cord into a fluffy, dense cloud of fringe.',
        imageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=900&q=80',
        tips: 'Place your non-dominant hand firmly over the spine knots while brushing to avoid tugging them loose.'
      },
      {
        id: 's5',
        stepNumber: 5,
        title: 'Trim, Stiffen, and Mount',
        description: 'Trace an oval or leaf template onto cardstock and place it over your combed fringe as a guide. Trim the outer edges into an elegant tapered feather silhouette. Generously mist both sides with fabric stiffener spray, allow to dry for 30 minutes, and mount onto your gallery wall.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
        tips: 'Let the stiffening spray cure completely before hanging to ensure the fringe holds its crisp shape indefinitely.'
      }
    ],
    finalLookImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    closingTips: 'Combine 3 or 5 feathers in contrasting neutral tones (such as oat, terracotta, and olive) across varying lengths to create an organic cascading look.',
    seoTitle: 'Easy DIY Macramé Feather Wall Hanging Tutorial | CraftNest',
    seoDescription: 'Create a gorgeous bohemian macramé feather wall hanging on driftwood with this beginner friendly guide. Full materials list and brushing technique.',
    focusKeyword: 'macrame feather wall hanging',
    ogImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    publishedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    views: 980,
    readingTimeMinutes: 5
  },
  {
    id: 'post-recycled-glass-lanterns',
    slug: 'eco-friendly-recycled-glass-jar-lanterns',
    title: 'Eco-Friendly Recycled Glass Jar Lanterns with Twine & Pressed Botanicals',
    excerpt: 'Turn empty salsa and pickle jars into glowing rustic patio lanterns with pressed wildflowers, natural jute twine, and tea lights.',
    introduction: 'Don’t toss out empty pasta sauce or jam jars! With a small handful of pressed garden florals and natural jute twine, you can upcycle plain glass into enchanting luminaries that cast warm, romantic patterns across your porch, dinner table, or backyard pathway.',
    categoryId: 'cat-recycling',
    categoryName: 'Recycling Crafts',
    tags: ['Upcycling', 'Mason Jars', 'Pressed Flowers', 'Outdoor Decor', 'Eco Friendly'],
    featuredImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    materials: [
      { id: 'm1', name: 'Assorted Cleaned Glass Jars (Labels Removed)', amount: '3-4 jars' },
      { id: 'm2', name: 'Pressed Wildflowers, Ferns, or Foliage', amount: '1 collection' },
      { id: 'm3', name: 'Mod Podge Matte Finish (or PVA craft glue mixed with water)', amount: '1 jar' },
      { id: 'm4', name: 'Flat Synthetic Foam Paintbrush', amount: '1 piece' },
      { id: 'm5', name: 'Natural Jute Twine (2-ply)', amount: '1 roll' },
      { id: 'm6', name: 'LED Flameless Tea Lights or Votive Candles', amount: '4 pieces' }
    ],
    videoUrl: '',
    difficulty: 'Easy',
    timeNeeded: '25 mins',
    steps: [
      {
        id: 's1',
        stepNumber: 1,
        title: 'Strip Jar Labels and Degrease Glass',
        description: 'Soak glass jars in hot water with baking soda and dish soap for 20 minutes to dissolve label adhesives cleanly. Rub off any remaining glue with coconut oil, then wipe down the exterior glass with rubbing alcohol to eliminate finger oils.',
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80',
        tips: 'A thoroughly degreased surface prevents the botanical seal from peeling over time.'
      },
      {
        id: 's2',
        stepNumber: 2,
        title: 'Apply Base Adhesive Layer',
        description: 'Brush a thin, even coat of matte Mod Podge onto the exterior glass surface where you plan to place your botanicals. Avoid making the glue layer too thick, which can cause bubbles or cloudiness as it dries.',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
        tips: 'Work on one side of the jar at a time so the glue doesn’t tack up before you lay down the florals.'
      },
      {
        id: 's3',
        stepNumber: 3,
        title: 'Arrange Pressed Botanicals',
        description: 'Using tweezers, gently place pressed pansies, baby’s breath, or delicate fern fronds onto the wet adhesive. Press down softly with your fingertips from the center of each leaf outward to expel trapped air pockets.',
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
        tips: 'Thinner flowers and pressed fern fronds bend naturally along curved jar glass much better than bulky petals.'
      },
      {
        id: 's4',
        stepNumber: 4,
        title: 'Top Seal with Protective Matte Coat',
        description: 'Carefully brush another layer of Mod Podge over the entire arrangement, extending slightly past the edges of the pressed plants. Allow the sealer to dry clear for at least 1 hour in a well-ventilated room.',
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
        tips: 'Matte sealant mimics frosted sea glass and diffuses candlelight with a soft, magical glow.'
      },
      {
        id: 's5',
        stepNumber: 5,
        title: 'Wrap the Rim and Craft a Twine Handle',
        description: 'Wrap natural jute twine around the screw-top threaded rim 5 to 6 times and secure with a knot. Create an arched loop handle by tying opposite sides together with a double fisherman’s knot. Drop an LED tealight inside and illuminate your space!',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
        tips: 'Add 2 cm of clean beach sand or pebbles to the bottom of the jar to weigh it down securely for breezy outdoor patios.'
      }
    ],
    finalLookImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    closingTips: 'For outdoor hanging use, ensure your twine handle is tied securely around the neck groove. Always use battery-operated LED tea lights when displaying around children or curious pets.',
    seoTitle: 'DIY Upcycled Glass Jar Lanterns with Pressed Flowers | CraftNest',
    seoDescription: 'Transform used glass jars into luminous rustic lanterns with pressed garden botanicals and jute twine in this easy 5-step upcycling project.',
    focusKeyword: 'recycled glass jar lanterns',
    ogImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    publishedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    views: 812,
    readingTimeMinutes: 4
  }
];

export const initialPages: PageContent[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About CraftNest',
    content: `
      <h2>Welcome to CraftNest – Your Sanctuary for Creative Living</h2>
      <p>At <strong>CraftNest</strong>, we believe that making things by hand is one of the most fulfilling, calming, and joyful ways to live. Whether you have 20 minutes to fold a quick origami favor or an entire weekend to craft custom home decor, our mission is to empower makers of all skill levels with crystal-clear, step-by-step visual tutorials that genuinely work.</p>
      
      <h3>Our Story & Creative Philosophy</h3>
      <p>Founded by passionate creators and makers, CraftNest started as a short-form video channel sharing satisfying craft transformations. As our community grew across YouTube, Instagram, and TikTok, hundreds of makers asked for detailed, repeatable written guides with full material checklists, measurement notes, and high-resolution visual steps. CraftNest was built to be that forever home for makers.</p>
      
      <h3>What Makes Our Tutorials Different</h3>
      <ul>
        <li><strong>Step-by-Step Visual Guidance:</strong> Every single tutorial breaks the project down into digestible 5–6 steps, paired with clear photos and maker tips.</li>
        <li><strong>Practical & Accessible Materials:</strong> We prioritize affordable, everyday materials like crepe paper, cotton cord, upcycled jars, and household staples.</li>
        <li><strong>Sustainability First:</strong> We actively advocate for eco-conscious crafting, celebrating upcycling and zero-waste projects that give discarded materials a beautiful second life.</li>
      </ul>

      <h3>Editorial Independence & Standards</h3>
      <p>Every craft featured on CraftNest is tested by our team before publishing. We do not promote products we haven't personally handled. Feel free to join our newsletter, leave questions in our comment sections, and share your handmade creations with us!</p>
    `,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    content: `
      <h2>Privacy Policy for CraftNest</h2>
      <p>Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <p>At <strong>CraftNest</strong> (accessible from our website), the privacy of our visitors is of extreme importance to us. This Privacy Policy document outlines the types of personal information received and collected by CraftNest and how it is used.</p>
      
      <h3>1. Information We Collect</h3>
      <p>When you browse our website, subscribe to our newsletter, leave a comment, or submit our contact form, we may collect the following details:</p>
      <ul>
        <li><strong>Voluntarily Provided Information:</strong> Your name, email address, and message content when submitting contact forms or subscribing.</li>
        <li><strong>Automated Data & Log Files:</strong> Like many web services, we utilize standard log files including internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. These are not linked to personally identifiable information.</li>
      </ul>

      <h3>2. Cookies and Web Beacons</h3>
      <p>CraftNest uses cookies to store information about visitors’ preferences, record user-specific information on which pages the user accesses, and customize web page content based on visitors’ browser types.</p>

      <h3>3. Google DoubleClick DART Cookie & Google AdSense Disclosure</h3>
      <p>Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to CraftNest and other sites on the internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network Privacy Policy at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.</p>
      <p>Our advertising partners may include Google AdSense and affiliated programmatic networks. These third-party ad servers use technology in their advertisements and links that appear on CraftNest. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our third-party ad networks to measure the effectiveness of their advertising campaigns and/or to personalize advertising content.</p>
      <p>CraftNest has no access to or control over these cookies used by third-party advertisers.</p>

      <h3>4. GDPR & CCPA Rights</h3>
      <p>Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to request access to your personal data, request corrections, or request deletion of your information from our database. To exercise these rights, please contact us via our Contact Us page.</p>

      <h3>5. Consent</h3>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
    `,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Terms & Conditions',
    content: `
      <h2>Terms and Conditions of Use</h2>
      <p>Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <h3>1. Introduction and Agreement</h3>
      <p>Welcome to <strong>CraftNest</strong>. By accessing or using this website, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please discontinue use of our site.</p>

      <h3>2. Intellectual Property Rights</h3>
      <p>Unless otherwise stated, CraftNest and/or its content licensors own the intellectual property rights for all material published on CraftNest, including written craft instructions, photos, step-by-step schematics, logos, and graphics. You may view and print pages for personal, non-commercial use only.</p>
      <p>You must not: republish material from CraftNest without attribution, sell or sub-license our content, or reproduce tutorials for commercial resale.</p>

      <h3>3. User Comments & Submissions</h3>
      <p>Users may post comments and suggestions on designated tutorial pages. CraftNest does not filter, edit, or endorse comments prior to publication, but reserves the full right to monitor and remove any comments deemed inappropriate, offensive, or infringing on intellectual property rights.</p>

      <h3>4. Governing Law</h3>
      <p>These terms and conditions are governed by and construed in accordance with standard international copyright and fair trade laws.</p>
    `,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'page-disclaimer',
    slug: 'disclaimer',
    title: 'Disclaimer & Safety Notice',
    content: `
      <h2>Safety, Crafting & Affiliate Disclaimer</h2>
      <p>Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <h3>1. Craft Safety & Tool Precautions</h3>
      <p>The tutorials and creative ideas published on <strong>CraftNest</strong> are provided for general educational, recreational, and inspirational purposes only. Crafting involves tools and materials that carry inherent risks, including but not limited to:</p>
      <ul>
        <li>Hot glue guns, heating irons, and heat embossers (burn hazards).</li>
        <li>Utility knives, precision craft blades, rotary cutters, and heavy shears (cut hazards).</li>
        <li>Aerosol sealants, fabric stiffeners, spray paints, and solvent glues (inhalation and ventilation hazards).</li>
        <li>Small beads, sharp wires, and broken glass fragments (choking and puncture hazards).</li>
      </ul>
      <p>Always work in a well-ventilated, well-lit workspace. Keep hot tools and sharp implements out of reach of unsupervised children and pets. CraftNest assumes no liability for injuries or damages resulting from the execution of our tutorials.</p>

      <h3>2. Kid Crafts Notice</h3>
      <p>Tutorials listed under our "Kids Crafts" category must always be conducted under active adult supervision. Ensure that all adhesives, paints, and supplies used are labeled non-toxic (AP certified).</p>

      <h3>3. Advertising and Affiliate Links</h3>
      <p>CraftNest displays Google AdSense advertisements and may occasionally include affiliate links to recommend supplies. When you click these links or make a purchase, we may earn a modest commission at no extra charge to you.</p>
    `,
    lastUpdated: new Date().toISOString()
  }
];

export const initialSettings: SiteSettings = {
  siteName: 'CraftNest',
  tagline: 'Your Home for Inspiring DIY & Step-by-Step Crafts',
  description: 'Discover easy, beautiful DIY craft tutorials, paper flowers, modern boho home decor, upcycling crafts, and handmade gifts with detailed step-by-step visual guides.',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#F26B5B', // Coral / Terracotta
  secondaryColor: '#2BB5A5', // Soft Teal
  accentColor: '#FFC857', // Sunny Yellow
  authorName: 'Elena Rostova',
  authorBio: 'Lifelong DIY enthusiast, paper artist, and video creator helping craft lovers bring warm handmade beauty into their homes.',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  pinterestUrl: 'https://pinterest.com',
  twitterUrl: 'https://x.com',
  adsensePublisherId: 'ca-pub-9876543210987654',
  adsenseEnabled: true,
  adsTxt: 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0',
  googleAnalyticsId: 'G-CRAFTNEST99',
  googleSearchConsoleTag: 'google-site-verification=craftnest_meta_verification_token',
  footerText: '© 2026 CraftNest. All rights reserved. Handcrafted with love for makers worldwide.',
  contactEmail: 'hello@craftnest.com'
};

export const initialAdmin: AdminUser = {
  id: 'admin-1',
  email: 'admin@craftnest.com',
  name: 'Elena (CraftNest Admin)',
  // Simple representation for demonstration and configuration
  passwordHash: 'admin123'
};
