import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import {
  admins,
  blogCategories,
  blogPosts,
  blogTags,
  blogPostTags,
} from "./schema";

dotenv.config();

async function runSeed() {
  console.log("🌱 Starting database seeding for Royal Chauffeur UAE...");

  try {
    // 1. Seed Default Administrator
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@royalchauffeuruae.com";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.length < 12) {
      throw new Error("Set INITIAL_ADMIN_PASSWORD (12+ chars) in .env before seeding.");
    }
    const adminName = process.env.INITIAL_ADMIN_NAME || "Royal Administrator";

    const existingAdmin = await db.select().from(admins).where(eq(admins.email, adminEmail));

    let adminId: number;
    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const [insertResult] = await db.insert(admins).values({
        email: adminEmail,
        passwordHash,
        name: adminName,
        role: "admin",
      });
      adminId = insertResult.insertId;
      console.log(`👤 Admin created: ${adminEmail} (ID: ${adminId})`);
    } else {
      adminId = existingAdmin[0].id;
      console.log(`👤 Admin already exists: ${adminEmail} (ID: ${adminId})`);
    }

    // 2. Seed Blog Categories
    const defaultCategories = [
      {
        name: "Dubai Travel & Itineraries",
        slug: "dubai-travel-itineraries",
        description: "Curated luxury itineraries, iconic sights, and insider recommendations across Dubai.",
      },
      {
        name: "Luxury Lifestyle & Fleet",
        slug: "luxury-lifestyle-fleet",
        description: "Spotlights on premium vehicles, bespoke amenities, and the UAE VIP lifestyle.",
      },
      {
        name: "Corporate & Executive Travel",
        slug: "corporate-executive-travel",
        description: "Professional chauffeur standards, roadshow logistics, and business executive transport.",
      },
      {
        name: "Airport Transfers & VIP Guides",
        slug: "airport-transfers-vip-guides",
        description: "Stress-free airport pickups at DXB, DWC, and Abu Dhabi international terminals.",
      },
    ];

    const categoryMap = new Map<string, number>();

    for (const cat of defaultCategories) {
      const existing = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, cat.slug));

      if (existing.length === 0) {
        const [result] = await db.insert(blogCategories).values(cat);
        categoryMap.set(cat.slug, result.insertId);
        console.log(`📁 Category created: ${cat.name}`);
      } else {
        categoryMap.set(cat.slug, existing[0].id);
      }
    }

    // 3. Seed Tags
    const defaultTags = [
      { name: "Dubai Travel", slug: "dubai-travel" },
      { name: "Luxury Chauffeur", slug: "luxury-chauffeur" },
      { name: "Airport Transfer", slug: "airport-transfer" },
      { name: "Executive Cars", slug: "executive-cars" },
      { name: "Mercedes S-Class", slug: "mercedes-s-class" },
      { name: "VIP Dubai", slug: "vip-dubai" },
    ];

    const tagMap = new Map<string, number>();
    for (const t of defaultTags) {
      const existing = await db.select().from(blogTags).where(eq(blogTags.slug, t.slug));
      if (existing.length === 0) {
        const [result] = await db.insert(blogTags).values(t);
        tagMap.set(t.slug, result.insertId);
      } else {
        tagMap.set(t.slug, existing[0].id);
      }
    }

    // 4. Seed Rich Blog Posts
    const samplePosts = [
      {
        title: "The Ultimate Guide to Dubai Airport Chauffeur Transfers (DXB & DWC)",
        slug: "ultimate-guide-dubai-airport-chauffeur-transfers",
        excerpt:
          "Navigating Dubai International Airport with seamless VIP baggage assistance, flight monitoring, and luxury door-to-door transfer in Mercedes S-Class or BMW 7 Series.",
        categorySlug: "airport-transfers-vip-guides",
        coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
        featured: true,
        readTime: "6 min read",
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
        content: `
Dubai International Airport (DXB) is one of the busiest travel hubs in the world. After a long flight, navigating baggage carousels, customs, and taxi queues can be overwhelming. Choosing a private chauffeur service ensures you transition effortlessly from the aircraft directly into the cool comfort of a climate-controlled luxury sedan.

## Why Book an Airport Chauffeur in Dubai?

Unlike standard metered taxis or on-demand rideshare apps where availability, surge pricing, and vehicle standards vary wildly, a pre-arranged chauffeur provides:

- **Guaranteed Vehicle Tier**: Travel in an immaculate Mercedes S-Class, BMW 7 Series, Cadillac Escalade, or GMC Yukon Denali.
- **Dedicated Flight Tracking**: Our operations desk tracks your tail number. If your flight lands 40 minutes ahead of schedule or faces headwinds, your driver is already staged.
- **Inside Terminal Meet & Greet**: Your smartly suited chauffeur greets you right outside the baggage exit holding a discreet digital or gold-embossed name badge.

## Terminal Pickup Logistics at DXB Terminal 1 & 3

When you touch down at DXB:
1. **Pass through Smart Gates / Immigration**: Dubai's automated biometric gates make passport control swift.
2. **Collect Checked Luggage**: Your chauffeur is on standby in the designated arrival hall.
3. **Escort to Vehicle**: Your driver takes care of all heavy bags and guides you to the private VIP parking bay, avoiding the heat.

## Booking Your Chauffeur Journey

Whether heading straight to a business conference at DIFC or checking into your resort on Palm Jumeirah, Royal Chauffeur UAE operates 24/7 with fixed hourly and point-to-point rates.
        `.trim(),
      },
      {
        title: "Top 7 Reasons Why Business Executives Choose Chauffeur Services in Dubai",
        slug: "reasons-executives-choose-chauffeur-services-dubai",
        excerpt:
          "From DIFC board meetings to Abu Dhabi state visits, discover why corporate leaders rely on dedicated chauffeurs for productivity, punctuality, and prestige.",
        categorySlug: "corporate-executive-travel",
        coverImage: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80",
        featured: false,
        readTime: "5 min read",
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
      },
      {
        title: "Dubai to Abu Dhabi Day Tour: The Ultimate Luxury Chauffeur Itinerary",
        slug: "dubai-to-abu-dhabi-luxury-day-tour-itinerary",
        excerpt:
          "Explore the Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Emirates Palace in uncompromised luxury with a dedicated private chauffeur.",
        categorySlug: "dubai-travel-itineraries",
        coverImage: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80",
        featured: false,
        readTime: "7 min read",
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
          {
            question: "Which vehicle is best suited for an Abu Dhabi day tour?",
            answer:
              "For couples and solo travelers, the Mercedes S-Class or BMW 7 Series provides unmatched riding serenity. For families or groups of 4-6, the GMC Yukon Denali or Cadillac Escalade offers elevated views and superior luggage space.",
          },
        ],
        metaTitle: "Dubai to Abu Dhabi Chauffeur Day Tour | Royal Chauffeur UAE",
        metaDescription:
          "Experience the best of Abu Dhabi on a private luxury chauffeur day tour from Dubai. Visit the Grand Mosque, Louvre Abu Dhabi, and Qasr Al Watan.",
        metaKeywords: "abu dhabi day tour from dubai, private driver dubai to abu dhabi, grand mosque tour chauffeur, luxury suv rental with driver",
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

## Evening: Sunset Return to Dubai

As the desert sunset blankets the horizon in amber tones, relax in the reclining leather seats of your private vehicle while your chauffeur delivers you safely back to Dubai.
        `.trim(),
      },
      {
        title: "Fleet Spotlight: Why the Mercedes-Benz S-Class Remains the King of Chauffeur Cars",
        slug: "fleet-spotlight-mercedes-benz-s-class-dubai",
        excerpt:
          "A deep dive into the engineering, whisper-quiet cabin acoustics, and unparalleled prestige of the Mercedes-Benz S-Class for UAE VIPs.",
        categorySlug: "luxury-lifestyle-fleet",
        coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
        featured: false,
        readTime: "4 min read",
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
          {
            question: "Is the S-Class available for both hourly hire and airport transfers?",
            answer:
              "Yes. You can book our S-Class for point-to-point airport transfers, daily business meetings, or weekly and monthly chauffeur arrangements.",
          },
        ],
        metaTitle: "Mercedes S-Class With Chauffeur In Dubai | Royal Chauffeur UAE",
        metaDescription:
          "Discover why the Mercedes-Benz S-Class is the top chauffeur car in Dubai. Review comfort specs, luxury rear-seat amenities, and booking details.",
        metaKeywords: "mercedes s class with driver dubai, rent mercedes s class chauffeur uae, luxury car hire dubai",
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
      },
    ];

    for (const post of samplePosts) {
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, post.slug));
      const categoryId = categoryMap.get(post.categorySlug) || null;

      if (existing.length === 0) {
        const [insertedPost] = await db.insert(blogPosts).values({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          categoryId,
          authorId: adminId,
          authorName: "Royal Chauffeur UAE",
          status: "published",
          featured: post.featured,
          readTime: post.readTime,
          viewsCount: Math.floor(Math.random() * 80) + 20,
          keyTakeaways: post.keyTakeaways,
          faqs: post.faqs,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          metaKeywords: post.metaKeywords,
          publishedAt: new Date(),
        });

        // Link with tags
        const relevantTag = tagMap.get("luxury-chauffeur");
        if (relevantTag) {
          await db.insert(blogPostTags).values({
            postId: insertedPost.insertId,
            tagId: relevantTag,
          });
        }

        console.log(`📝 Blog post seeded: "${post.title}"`);
      } else {
        console.log(`📝 Blog post already exists: "${post.title}"`);
      }
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();

