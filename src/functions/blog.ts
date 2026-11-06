import { createServerFn } from "@tanstack/react-start";
import { eq, desc, and, sql, like, or } from "drizzle-orm";
import { db, checkDbConnection } from "../db";
import {
  admins,
  blogCategories,
  blogPosts,
  blogTags,
  blogPostTags,
  type BlogPost,
  type BlogCategory,
} from "../db/schema";
import { verifyPassword, signAdminToken, verifyAdminToken } from "../lib/auth";

// ============================================================================
// Fallback Sample Data (Ensures graceful rendering if MySQL is not yet configured)
// ============================================================================
const FALLBACK_CATEGORIES: BlogCategory[] = [
  {
    id: 1,
    name: "Dubai Travel & Itineraries",
    slug: "dubai-travel-itineraries",
    description: "Curated luxury itineraries, iconic sights, and insider recommendations across Dubai.",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Luxury Lifestyle & Fleet",
    slug: "luxury-lifestyle-fleet",
    description: "Spotlights on premium vehicles, bespoke amenities, and the UAE VIP lifestyle.",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Corporate & Executive Travel",
    slug: "corporate-executive-travel",
    description: "Professional chauffeur standards, roadshow logistics, and business executive transport.",
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Airport Transfers & VIP Guides",
    slug: "airport-transfers-vip-guides",
    description: "Stress-free airport pickups at DXB, DWC, and Abu Dhabi international terminals.",
    createdAt: new Date(),
  },
];

const FALLBACK_POSTS: Array<BlogPost & { categoryName?: string; categorySlug?: string }> = [
  {
    id: 1,
    title: "The Ultimate Guide to Dubai Airport Chauffeur Transfers (DXB & DWC)",
    slug: "ultimate-guide-dubai-airport-chauffeur-transfers",
    excerpt:
      "Navigating Dubai International Airport with seamless VIP baggage assistance, flight monitoring, and luxury door-to-door transfer in Mercedes S-Class or BMW 7 Series.",
    content: `
Dubai International Airport (DXB) is one of the busiest travel hubs in the world. After a long flight, navigating baggage carousels, customs, and taxi queues can be overwhelming. Choosing a private chauffeur service ensures you transition effortlessly from the aircraft directly into the cool comfort of a climate-controlled luxury sedan.

## Why Book an Airport Chauffeur in Dubai?

Unlike standard metered taxis or on-demand rideshare apps where availability, surge pricing, and vehicle standards vary wildly, a pre-arranged chauffeur provides:

- **Guaranteed Vehicle Tier**: Travel in an immaculate Mercedes S-Class, BMW 7 Series, Cadillac Escalade, or GMC Yukon Denali.
- **Dedicated Flight Tracking**: Our operations desk tracks your flight in real time. If your flight lands 40 minutes ahead of schedule or faces headwinds, your driver is already staged.
- **Inside Terminal Meet & Greet**: Your smartly suited chauffeur greets you right outside the baggage exit holding a discreet digital or gold-embossed name badge.

## Terminal Pickup Logistics at DXB Terminal 1 & 3

When you touch down at DXB:
1. **Pass through Smart Gates / Immigration**: Dubai's automated biometric gates make passport control swift.
2. **Collect Checked Luggage**: Your chauffeur is on standby in the designated arrival hall.
3. **Escort to Vehicle**: Your driver takes care of all heavy bags and guides you to the private VIP parking bay, avoiding the heat.

## Booking Your Chauffeur Journey

Whether heading straight to a business conference at DIFC or checking into your resort on Palm Jumeirah, Royal Chauffeur UAE operates 24/7 with fixed hourly and point-to-point rates.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    categoryId: 4,
    categoryName: "Airport Transfers & VIP Guides",
    categorySlug: "airport-transfers-vip-guides",
    authorId: 1,
    authorName: "Royal Chauffeur UAE",
    status: "published",
    featured: true,
    readTime: "6 min read",
    viewsCount: 142,
    keyTakeaways: JSON.stringify([
      "Real-time flight radar tracking ensures zero waiting time regardless of arrival delays.",
      "Meet & Greet service includes luggage escort from arrivals hall directly to the executive curb.",
      "Fixed, transparent pricing with no surge fees during peak Dubai travel seasons.",
      "Complimentary onboard high-speed Wi-Fi, refreshments, and tailored temperature control.",
    ]),
    faqs: [
      {
        question: "How does the chauffeur track my flight arriving at DXB?",
        answer:
          "We monitor flight numbers in real-time. Even if your flight is early or delayed by several hours, your chauffeur adjusts automatically and waits in the arrivals terminal with a personalized name board.",
      },
      {
        question: "Is waiting time complimentary for airport pickups?",
        answer:
          "Yes, all international airport pickups include 60 minutes of complimentary waiting time after flight touchdown to allow ample time for immigration and baggage retrieval.",
      },
      {
        question: "Can I book a child car seat or executive luggage van?",
        answer:
          "Certainly. We provide certified ISOFIX child booster seats upon request and offer spacious luxury vans like the Toyota Sienna and Mercedes V-Class for large families.",
      },
    ],
    metaTitle: "Dubai Airport Chauffeur Transfer (DXB & DWC) Guide | Royal Chauffeur UAE",
    metaDescription:
      "Experience stress-free VIP airport transfers at Dubai Airport. Discover our flight tracking, meet & greet baggage assistance, and executive fleet.",
    metaKeywords: "dubai airport transfer, dxb chauffeur, executive airport pickup, luxury car rental with driver dubai",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Top 7 Reasons Why Business Executives Choose Chauffeur Services in Dubai",
    slug: "reasons-executives-choose-chauffeur-services-dubai",
    excerpt:
      "From DIFC board meetings to Abu Dhabi state visits, discover why corporate leaders rely on dedicated chauffeurs for productivity, punctuality, and prestige.",
    content: `
In Dubai's fast-paced corporate landscape, time is the ultimate luxury. Managing heavy traffic on Sheikh Zayed Road or hunting for valet parking at conference venues wastes valuable minutes that could be spent preparing for board presentations or closing deals.

## The Executive Mobile Office

Modern luxury sedans like the Mercedes-Benz S-Class and BMW 7-Series are engineered with executive rear-seat ergonomics:
- Reclining executive seating with massage functionality.
- Acoustic glass insulation dampening road noise for pristine conference calls.
- High-speed onboard 5G connectivity and multiple device charging stations.

## Roadshows and Multi-Stop Itineraries

Corporate visits often demand jumping between multiple venues:
- Morning strategy briefing at **Dubai International Financial Centre (DIFC)**.
- Lunch meeting at **Downtown Dubai**.
- Afternoon factory inspection in **Jebel Ali Free Zone (JAFZA)**.
- Evening diplomatic reception in **Abu Dhabi**.

With our daily and hourly standby packages, your chauffeur remains parked on-site, ready to roll the moment you step out of the lobby.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80",
    categoryId: 3,
    categoryName: "Corporate & Executive Travel",
    categorySlug: "corporate-executive-travel",
    authorId: 1,
    authorName: "Royal Chauffeur UAE",
    status: "published",
    featured: false,
    readTime: "5 min read",
    viewsCount: 98,
    keyTakeaways: JSON.stringify([
      "Transform transit time into an undisturbed mobile office with privacy partitions and Wi-Fi.",
      "Eliminate parking hassles and navigation stress in high-density districts like Downtown and DIFC.",
      "Present an impeccably polished image for high-stakes investor meetings and VIP clients.",
      "Flexible hourly standby packages allow seamless multi-stop roadshows without waiting.",
    ]),
    faqs: [
      {
        question: "Can business clients arrange monthly corporate accounts?",
        answer:
          "Yes, Royal Chauffeur UAE provides streamlined corporate billing with consolidated monthly VAT invoicing, dedicated account managers, and priority vehicle allocation.",
      },
      {
        question: "Are chauffeurs trained in non-disclosure and privacy etiquette?",
        answer:
          "All our drivers sign strict Non-Disclosure Agreements (NDAs) and adhere to executive etiquette standards, ensuring your confidential calls and conversations remain private.",
      },
    ],
    metaTitle: "Corporate Chauffeur Service Dubai | Executive Transport | Royal Chauffeur",
    metaDescription:
      "Discover how executive chauffeur services optimize corporate roadshows, DIFC meetings, and VIP delegations across Dubai and Abu Dhabi.",
    metaKeywords: "corporate chauffeur dubai, executive transport uae, difc business driver, roadshow transport dubai",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Dubai to Abu Dhabi Day Tour: The Ultimate Luxury Chauffeur Itinerary",
    slug: "dubai-to-abu-dhabi-luxury-day-tour-itinerary",
    excerpt:
      "Explore the Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Emirates Palace in uncompromised luxury with a dedicated private chauffeur.",
    content: `
The UAE capital of Abu Dhabi represents a captivating blend of deep Arabian heritage, cutting-edge architectural marvels, and world-class cultural institutions. Located just 130 kilometers south of Dubai, it makes for the perfect day excursion.

## Morning: Sheikh Zayed Grand Mosque

Departing your Dubai hotel at 9:00 AM, your chauffeur glides along the Sheikh Zayed Road highway. In approximately 75 minutes, you arrive at the majestic **Sheikh Zayed Grand Mosque**:
- 82 pristine white marble domes.
- The world's largest hand-knotted Persian carpet.
- 24-carat gold gilded chandeliers.

Your driver coordinates with VIP security gates for swift drop-off right at the visitor entrance.

## Midday: High Tea or Lunch at Emirates Palace Mandarin Oriental

After exploring the mosque, enjoy an opulent lunch or gold-dusted cappuccino at the iconic **Emirates Palace**. Your chauffeur awaits outside, ready to assist whenever your dining concludes.

## Afternoon: Louvre Abu Dhabi & Saadiyat Island

Next, head to the cultural district of Saadiyat Island to experience the **Louvre Abu Dhabi**, designed by Pritzker Prize-winning architect Jean Nouvel. Stroll beneath the iconic geometric dome that filters sunlight into a mesmerizing "rain of light."
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80",
    categoryId: 1,
    categoryName: "Dubai Travel & Itineraries",
    categorySlug: "dubai-travel-itineraries",
    authorId: 1,
    authorName: "Royal Chauffeur UAE",
    status: "published",
    featured: false,
    readTime: "7 min read",
    viewsCount: 165,
    keyTakeaways: JSON.stringify([
      "Effortless 90-minute cruise along the E11 highway in a spacious luxury SUV or sedan.",
      "Door-to-door access at prestigious cultural landmarks with zero parking delays.",
      "Customizable schedule: linger as long as you desire at the Louvre or Sheikh Zayed Mosque.",
      "Chilled complimentary mineral water, wet towels, and snacks on board throughout the excursion.",
    ]),
    faqs: [
      {
        question: "How long does a private chauffeur day tour to Abu Dhabi take?",
        answer:
          "A typical full-day itinerary spans 8 to 10 hours, covering pickup in Dubai, visits to 3-4 major Abu Dhabi attractions, lunch at Emirates Palace, and a relaxed return journey.",
      },
    ],
    metaTitle: "Dubai to Abu Dhabi Chauffeur Day Tour | Royal Chauffeur UAE",
    metaDescription:
      "Experience the best of Abu Dhabi on a private luxury chauffeur day tour from Dubai. Visit the Grand Mosque, Louvre Abu Dhabi, and Qasr Al Watan.",
    metaKeywords: "abu dhabi day tour from dubai, private driver dubai to abu dhabi, grand mosque tour chauffeur",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Fleet Spotlight: Why the Mercedes-Benz S-Class Remains the King of Chauffeur Cars",
    slug: "fleet-spotlight-mercedes-benz-s-class-dubai",
    excerpt:
      "A deep dive into the engineering, whisper-quiet cabin acoustics, and unparalleled prestige of the Mercedes-Benz S-Class for UAE VIPs.",
    content: `
Across the globe, one vehicle stands as the undisputed benchmark of executive transportation: the **Mercedes-Benz S-Class**. In the United Arab Emirates, where luxury and excellence are everyday expectations, the S-Class commands unmatched respect.

## Whisper-Quiet Cabin Serenity

Stepping into the rear compartment of our S-Class fleet is akin to entering a private sanctuary. Acoustic double-pane safety glass, comprehensive sound-dampening insulation, and active road noise filtration keep the roar of highway traffic completely outside.

## Tailored for UAE Climatic Comfort

Dubai summers demand extraordinary climate control engineering. The S-Class features:
- High-capacity quad-zone digital climate management.
- Ventilated cooling leather seats with rapid perforation airflow.
- Electric privacy sunblinds for rear and side windows.

## The Royal Chauffeur Experience

Every Mercedes S-Class in our fleet is maintained to factory showroom standards, sanitized prior to every dispatch, and captained by an RTA-certified, English-speaking professional chauffeur.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
    categoryId: 2,
    categoryName: "Luxury Lifestyle & Fleet",
    categorySlug: "luxury-lifestyle-fleet",
    authorId: 1,
    authorName: "Royal Chauffeur UAE",
    status: "published",
    featured: false,
    readTime: "4 min read",
    viewsCount: 210,
    keyTakeaways: JSON.stringify([
      "Industry-leading AIRMATIC air suspension eliminates road bumps and highway vibrations.",
      "Thermotronic multi-zone climate control engineered specifically for desert summer temperatures.",
      "Burmester 3D Surround Sound system with active road noise cancellation.",
      "Universal symbol of distinction recognized at every luxury hotel and royal pavilion.",
    ]),
    faqs: [
      {
        question: "How many passengers can comfortably fit in a Mercedes S-Class?",
        answer:
          "The Mercedes-Benz S-Class comfortably seats up to 3 passengers with 2 large suitcases and 2 carry-on bags.",
      },
    ],
    metaTitle: "Mercedes S-Class With Chauffeur In Dubai | Royal Chauffeur UAE",
    metaDescription:
      "Discover why the Mercedes-Benz S-Class is the top chauffeur car in Dubai. Review comfort specs, luxury rear-seat amenities, and booking details.",
    metaKeywords: "mercedes s class with driver dubai, rent mercedes s class chauffeur uae, luxury car hire dubai",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// ============================================================================
// 1. PUBLIC SERVER FUNCTIONS
// ============================================================================

export const getPublishedBlogPostsFn = createServerFn({ method: "GET" })
  .validator((input?: { categorySlug?: string; search?: string }) => input || {})
  .handler(async ({ data }) => {
    const { categorySlug, search } = data || {};

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      let filtered = FALLBACK_POSTS.filter((p) => p.status === "published");
      if (categorySlug) {
        filtered = filtered.filter((p) => p.categorySlug === categorySlug);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q))
        );
      }
      return { posts: filtered, isFallback: true };
    }

    try {
      const conditions = [eq(blogPosts.status, "published")];

      if (categorySlug) {
        const cat = await db
          .select({ id: blogCategories.id })
          .from(blogCategories)
          .where(eq(blogCategories.slug, categorySlug))
          .limit(1);

        if (cat.length > 0) {
          conditions.push(eq(blogPosts.categoryId, cat[0].id));
        }
      }

      if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(
          or(
            like(blogPosts.title, searchPattern),
            like(blogPosts.excerpt, searchPattern),
            like(blogPosts.content, searchPattern)
          )!
        );
      }

      const rows = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          coverImage: blogPosts.coverImage,
          categoryId: blogPosts.categoryId,
          authorId: blogPosts.authorId,
          authorName: blogPosts.authorName,
          status: blogPosts.status,
          featured: blogPosts.featured,
          readTime: blogPosts.readTime,
          viewsCount: blogPosts.viewsCount,
          keyTakeaways: blogPosts.keyTakeaways,
          faqs: blogPosts.faqs,
          metaTitle: blogPosts.metaTitle,
          metaDescription: blogPosts.metaDescription,
          metaKeywords: blogPosts.metaKeywords,
          publishedAt: blogPosts.publishedAt,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          categoryName: blogCategories.name,
          categorySlug: blogCategories.slug,
        })
        .from(blogPosts)
        .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(and(...conditions))
        .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt), desc(blogPosts.createdAt));

      return { posts: rows, isFallback: false };
    } catch (err) {
      console.error("Error in getPublishedBlogPostsFn:", err);
      return { posts: FALLBACK_POSTS, isFallback: true };
    }
  });

export const getBlogPostBySlugFn = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { slug } = data;

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      const post = FALLBACK_POSTS.find((p) => p.slug === slug && p.status === "published");
      if (!post) return null;
      const related = FALLBACK_POSTS.filter((p) => p.slug !== slug && p.status === "published").slice(0, 3);
      return { post, related, isFallback: true };
    }

    try {
      const rows = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          coverImage: blogPosts.coverImage,
          categoryId: blogPosts.categoryId,
          authorId: blogPosts.authorId,
          authorName: blogPosts.authorName,
          status: blogPosts.status,
          featured: blogPosts.featured,
          readTime: blogPosts.readTime,
          viewsCount: blogPosts.viewsCount,
          keyTakeaways: blogPosts.keyTakeaways,
          faqs: blogPosts.faqs,
          metaTitle: blogPosts.metaTitle,
          metaDescription: blogPosts.metaDescription,
          metaKeywords: blogPosts.metaKeywords,
          publishedAt: blogPosts.publishedAt,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          categoryName: blogCategories.name,
          categorySlug: blogCategories.slug,
        })
        .from(blogPosts)
        .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
        .limit(1);

      if (rows.length === 0) return null;
      const post = rows[0];

      const related = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          coverImage: blogPosts.coverImage,
          readTime: blogPosts.readTime,
          publishedAt: blogPosts.publishedAt,
          categoryName: blogCategories.name,
          categorySlug: blogCategories.slug,
        })
        .from(blogPosts)
        .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(and(sql`${blogPosts.slug} != ${slug}`, eq(blogPosts.status, "published")))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(3);

      return { post, related, isFallback: false };
    } catch (err) {
      console.error("Error in getBlogPostBySlugFn:", err);
      const post = FALLBACK_POSTS.find((p) => p.slug === slug);
      if (!post) return null;
      const related = FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
      return { post, related, isFallback: true };
    }
  });

export const incrementBlogPostViewsFn = createServerFn({ method: "POST" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    try {
      const dbStatus = await checkDbConnection();
      if (!dbStatus.ok) return { success: true };

      await db
        .update(blogPosts)
        .set({
          viewsCount: sql`${blogPosts.viewsCount} + 1`,
        })
        .where(eq(blogPosts.slug, data.slug));

      return { success: true };
    } catch {
      return { success: false };
    }
  });

export const getBlogCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const dbStatus = await checkDbConnection();
  if (!dbStatus.ok) {
    return {
      categories: FALLBACK_CATEGORIES.map((c) => ({
        ...c,
        postCount: FALLBACK_POSTS.filter((p) => p.categoryId === c.id && p.status === "published").length,
      })),
      isFallback: true,
    };
  }

  try {
    const cats = await db.select().from(blogCategories).orderBy(blogCategories.name);
    const postCounts = await db
      .select({
        categoryId: blogPosts.categoryId,
        count: sql<number>`count(*)`,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .groupBy(blogPosts.categoryId);

    const countMap = new Map<number, number>();
    for (const item of postCounts) {
      if (item.categoryId) countMap.set(item.categoryId, Number(item.count));
    }

    const categoriesWithCount = cats.map((cat) => ({
      ...cat,
      postCount: countMap.get(cat.id) || 0,
    }));

    return { categories: categoriesWithCount, isFallback: false };
  } catch (err) {
    console.error("Error in getBlogCategoriesFn:", err);
    return { categories: FALLBACK_CATEGORIES.map((c) => ({ ...c, postCount: 1 })), isFallback: true };
  }
});

// ============================================================================
// 2. ADMIN AUTH & DASHBOARD SERVER FUNCTIONS
// ============================================================================

// Simple in-memory brute-force protection (per email + per IP). Resets on process restart,
// which is acceptable for a single-process shared-hosting deployment.
const loginAttempts = new Map<string, { count: number; firstAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAt > LOGIN_WINDOW_MS) return false;
  return entry.count >= LOGIN_MAX_ATTEMPTS;
}
function recordFailure(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.firstAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
  if (loginAttempts.size > 5000) loginAttempts.clear();
}

// Used so that "unknown email" and "wrong password" take the same time.
const DUMMY_BCRYPT_HASH = "$2b$10$f31ZvkTUqnf3LJjyDS3gueoFQy6LkRkWvsPUewYs1pacV6eeIDExi";

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((input: { email: string; password: string }) => {
    if (!input || typeof input.email !== "string" || typeof input.password !== "string") {
      throw new Error("Invalid input");
    }
    return { email: input.email.trim().toLowerCase().slice(0, 255), password: input.password.slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const { getRequestIP } = await import("@tanstack/react-start/server");
    let ip = "unknown";
    try {
      ip = getRequestIP({ xForwardedFor: true }) || "unknown";
    } catch {
      // ignore
    }
    const emailKey = `email:${email}`;
    const ipKey = `ip:${ip}`;

    if (isRateLimited(emailKey) || isRateLimited(ipKey)) {
      return { success: false, error: "Too many login attempts. Please wait 15 minutes and try again." };
    }

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      // Never fall back to a default/env password here: that was a login backdoor whenever MySQL was down.
      console.error("[Login] Database unavailable:", dbStatus.message);
      return {
        success: false,
        error: "Server cannot reach the database. Check DB settings in .env on the server (see server logs).",
      };
    }

    try {
      const rows = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
      const admin = rows[0];
      const valid = await verifyPassword(password, admin?.passwordHash || DUMMY_BCRYPT_HASH);

      if (!admin || !valid) {
        recordFailure(emailKey);
        recordFailure(ipKey);
        return { success: false, error: "Invalid email or password." };
      }

      loginAttempts.delete(emailKey);

      const token = await signAdminToken({
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });

      return {
        success: true,
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      };
    } catch (err) {
      console.error("Login error:", err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("ADMIN_JWT_SECRET")) {
        return { success: false, error: "Server misconfigured: ADMIN_JWT_SECRET is missing or too short." };
      }
      const code = String((err as { code?: unknown })?.code || (err instanceof Error ? err.name : "UNKNOWN"));
      if (/doesn't exist|ER_NO_SUCH_TABLE/i.test(msg)) {
        return { success: false, error: "Database tables are missing. Import drizzle/full_setup.sql in phpMyAdmin." };
      }
      if (/ER_BAD_FIELD_ERROR|Unknown column/i.test(code + msg)) {
        return {
          success: false,
          error: "The 'admins' table has different columns than expected. Re-create it from drizzle/full_setup.sql. (ER_BAD_FIELD_ERROR)",
        };
      }
      if (/ER_TABLEACCESS_DENIED|ER_DBACCESS_DENIED|ER_ACCESS_DENIED/i.test(code)) {
        return {
          success: false,
          error: `The DB user lacks permissions. In cPanel > MySQL Databases, add the user to the database with ALL PRIVILEGES. (${code})`,
        };
      }
      if (/salt|Illegal arguments|Invalid hash/i.test(msg)) {
        return {
          success: false,
          error: "The stored admin password is not a bcrypt hash. Reset it with an UPDATE using a bcrypt hash. (INVALID_HASH)",
        };
      }
      // Only the error code (no message/stack) is shown publicly; full details go to the server log.
      return { success: false, error: `Server error during login (code: ${code.slice(0, 40)}). Check server logs.` };
    }
  });

export const getAdminSessionFn = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    if (!data.token) return { admin: null };
    const admin = await verifyAdminToken(data.token);
    return { admin };
  });

export const getAdminDashboardStatsFn = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      return {
        totalPosts: FALLBACK_POSTS.length,
        publishedPosts: FALLBACK_POSTS.filter((p) => p.status === "published").length,
        draftPosts: FALLBACK_POSTS.filter((p) => p.status === "draft").length,
        totalViews: FALLBACK_POSTS.reduce((sum, p) => sum + p.viewsCount, 0),
        totalCategories: FALLBACK_CATEGORIES.length,
        recentPosts: FALLBACK_POSTS.slice(0, 5),
      };
    }

    try {
      const allPosts = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          status: blogPosts.status,
          viewsCount: blogPosts.viewsCount,
          createdAt: blogPosts.createdAt,
          categoryName: blogCategories.name,
        })
        .from(blogPosts)
        .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .orderBy(desc(blogPosts.createdAt));

      const categoriesCount = await db.select({ count: sql<number>`count(*)` }).from(blogCategories);

      const totalPosts = allPosts.length;
      const publishedPosts = allPosts.filter((p) => p.status === "published").length;
      const draftPosts = allPosts.filter((p) => p.status === "draft").length;
      const totalViews = allPosts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        totalCategories: Number(categoriesCount[0]?.count || 0),
        recentPosts: allPosts.slice(0, 5),
      };
    } catch (err) {
      console.error("Dashboard stats error:", err);
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        totalCategories: 0,
        recentPosts: [],
      };
    }
  });

export const getAdminBlogPostsFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; status?: string; search?: string }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      let filtered = [...FALLBACK_POSTS];
      if (data.status && data.status !== "all") {
        filtered = filtered.filter((p) => p.status === data.status);
      }
      if (data.search) {
        const q = data.search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
      }
      return { posts: filtered };
    }

    try {
      const conditions = [];
      if (data.status && data.status !== "all") {
        conditions.push(eq(blogPosts.status, data.status as "draft" | "published" | "archived"));
      }
      if (data.search) {
        conditions.push(like(blogPosts.title, `%${data.search}%`));
      }

      const rows = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          coverImage: blogPosts.coverImage,
          categoryId: blogPosts.categoryId,
          categoryName: blogCategories.name,
          status: blogPosts.status,
          featured: blogPosts.featured,
          readTime: blogPosts.readTime,
          viewsCount: blogPosts.viewsCount,
          publishedAt: blogPosts.publishedAt,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(blogPosts.createdAt));

      return { posts: rows };
    } catch (err) {
      console.error("Admin blog list error:", err);
      return { posts: FALLBACK_POSTS };
    }
  });

export const getAdminBlogPostByIdFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: number }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      const p = FALLBACK_POSTS.find((post) => post.id === data.id);
      return { post: p || null };
    }

    try {
      const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, data.id)).limit(1);
      return { post: rows[0] || null };
    } catch (err) {
      console.error("Get post by ID error:", err);
      return { post: null };
    }
  });

export const saveBlogPostFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      token: string;
      id?: number;
      post: {
        title: string;
        slug: string;
        excerpt?: string;
        content: string;
        coverImage?: string;
        categoryId?: number | null;
        status: "draft" | "published" | "archived";
        featured?: boolean;
        keyTakeaways?: string;
        faqs?: Array<{ question: string; answer: string }>;
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string;
      };
    }) => input
  )
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const { id, post } = data;
    const readTime = calculateReadTime(post.content);

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) {
      return { success: false, error: "Database unavailable — post was NOT saved." };
    }

    try {
      const values = {
        title: post.title,
        slug: post.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        excerpt: post.excerpt || null,
        content: post.content,
        coverImage: post.coverImage || null,
        categoryId: post.categoryId || null,
        authorId: session.adminId,
        authorName: session.name,
        status: post.status,
        featured: post.featured || false,
        readTime,
        keyTakeaways: post.keyTakeaways || null,
        faqs: post.faqs || null,
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt,
        metaKeywords: post.metaKeywords || null,
        publishedAt: post.status === "published" ? new Date() : null,
      };

      if (id) {
        await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
        return { success: true, id };
      } else {
        const [result] = await db.insert(blogPosts).values(values);
        return { success: true, id: result.insertId };
      }
    } catch (err: unknown) {
      console.error("Save blog post error:", err);
      const message = err instanceof Error ? err.message : "Database error";
      return { success: false, error: message };
    }
  });

export const deleteBlogPostFn = createServerFn({ method: "POST" })
  .validator((input: { token: string; id: number }) => input)
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) return { success: false, error: "Database unavailable." };

    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, data.id));
      return { success: true };
    } catch (err) {
      console.error("Delete blog post error:", err);
      return { success: false, error: "Failed to delete post." };
    }
  });

export const manageCategoriesFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      token: string;
      action: "create" | "update" | "delete";
      data: { id?: number; name?: string; slug?: string; description?: string };
    }) => input
  )
  .handler(async ({ data }) => {
    const session = await verifyAdminToken(data.token);
    if (!session) throw new Error("Unauthorized");

    const dbStatus = await checkDbConnection();
    if (!dbStatus.ok) return { success: false, error: "Database unavailable." };

    const { action, data: catData } = data;

    try {
      if (action === "create" && catData.name) {
        const slug = (catData.slug || catData.name)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-");
        await db.insert(blogCategories).values({
          name: catData.name,
          slug,
          description: catData.description || null,
        });
        return { success: true };
      }

      if (action === "update" && catData.id && catData.name) {
        await db
          .update(blogCategories)
          .set({
            name: catData.name,
            slug: catData.slug?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || undefined,
            description: catData.description || null,
          })
          .where(eq(blogCategories.id, catData.id));
        return { success: true };
      }

      if (action === "delete" && catData.id) {
        await db.delete(blogCategories).where(eq(blogCategories.id, catData.id));
        return { success: true };
      }

      return { success: false, error: "Invalid parameters" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Category operation failed";
      return { success: false, error: msg };
    }
  });
