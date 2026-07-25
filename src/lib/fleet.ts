import fleetCivic from "@/assets/fleet-civic.jpg";
import fleetBmw from "@/assets/fleet-bmw.jpg";
import fleetMercedes from "@/assets/fleet-mercedes.jpg";
import fleetPatrol from "@/assets/fleet-patrol.jpg";
import fleetLexus from "@/assets/fleet-lexus.jpg";
import fleetYukon from "@/assets/fleet-yukon.jpg";

export type FleetCar = {
  slug: string;
  name: string;
  tier: string;
  seats: number;
  bags: number;
  img: string;
  short: string;
  hero: string;
  highlights: string[];
  bestFor: string[];
  specs: { label: string; value: string }[];
  gallery?: string[];
};

export const fleet: FleetCar[] = [
  {
    slug: "honda-civic",
    name: "Honda Civic",
    tier: "Everyday Sedan",
    seats: 3,
    bags: 2,
    img: fleetCivic,
    short:
      "A smooth, fuel-friendly sedan for daily errands, school runs and quick city hops.",
    hero: "The Honda Civic is our workhorse sedan — reliable, comfortable and light on fuel. Ideal for daily driving around Dubai, school pickups and short business trips.",
    highlights: [
      "Fuel-efficient for daily use",
      "Comfortable cloth or leather cabin",
      "Bluetooth audio and USB charging",
      "Compact, easy to park in Dubai malls",
    ],
    bestFor: ["School run", "Daily errands", "Airport transfers (1–2 pax)"],
    specs: [
      { label: "Class", value: "Everyday Sedan" },
      { label: "Passengers", value: "Up to 3" },
      { label: "Luggage", value: "2 large bags" },
      { label: "Transmission", value: "Automatic" },
      { label: "AC", value: "Dual-zone climate" },
    ],
  },
  {
    slug: "bmw",
    name: "BMW",
    tier: "Business Sedan",
    seats: 3,
    bags: 2,
    img: fleetBmw,
    short:
      "A polished ride for boardroom meetings, hotel transfers and airport pickups.",
    hero: "A dark-tinted BMW driven by a professional chauffeur — the quiet, confident way to arrive at any business meeting or five-star hotel in Dubai.",
    highlights: [
      "Executive leather interior",
      "Ambient lighting and rear-cabin comfort",
      "Complimentary bottled water",
      "Tinted glass for privacy",
    ],
    bestFor: ["Executive transfers", "Airport meet & greet", "Hotel roadshows"],
    specs: [
      { label: "Class", value: "Business Sedan" },
      { label: "Passengers", value: "Up to 3" },
      { label: "Luggage", value: "2 large bags" },
      { label: "Transmission", value: "Automatic" },
      { label: "Interior", value: "Full leather" },
    ],
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    tier: "Signature Sedan",
    seats: 3,
    bags: 2,
    img: fleetMercedes,
    short:
      "The classic chauffeur experience — quiet cabin, leather seats, effortless glide.",
    hero: "The Mercedes-Benz is the industry standard for chauffeur service in Dubai. A whisper-quiet ride with a rear cabin built for real work — or a very calm airport drop-off.",
    highlights: [
      "Signature Mercedes ride quality",
      "Reclining rear seats on select cars",
      "Chilled bottled water on board",
      "Wi-Fi hotspot on request",
    ],
    bestFor: ["VIP transfers", "Business travelers", "Wedding cars"],
    specs: [
      { label: "Class", value: "Signature Sedan" },
      { label: "Passengers", value: "Up to 3" },
      { label: "Luggage", value: "2 large bags" },
      { label: "Transmission", value: "Automatic" },
      { label: "Cabin", value: "Nappa leather" },
    ],
  },
  {
    slug: "nissan-patrol",
    name: "Nissan Patrol",
    tier: "Family SUV",
    seats: 6,
    bags: 4,
    img: fleetPatrol,
    short:
      "Commanding, spacious and desert-ready — built for families and weekend getaways.",
    hero: "The Nissan Patrol is a Dubai icon — big, cool, and unbeatable on long highway runs. Perfect for family airport pickups, Hatta trips or a weekend in Ras Al Khaimah.",
    highlights: [
      "Three rows, real luggage space",
      "Ice-cold rear AC vents",
      "Great highway ride to Abu Dhabi or RAK",
      "Ideal for desert & mountain trips",
    ],
    bestFor: ["Family transfers", "Group airport pickup", "Weekend getaways"],
    specs: [
      { label: "Class", value: "Full-size Family SUV" },
      { label: "Passengers", value: "Up to 6" },
      { label: "Luggage", value: "4 large bags" },
      { label: "Drive", value: "4WD" },
      { label: "Cabin", value: "Leather, 3 rows" },
    ],
  },
  {
    slug: "lexus",
    name: "Lexus",
    tier: "Refined Sedan",
    seats: 3,
    bags: 2,
    img: fleetLexus,
    short:
      "Japanese luxury with a whisper-quiet cabin — a favourite for long executive drives.",
    hero: "The Lexus blends the calm of a Japanese luxury cabin with the polish expected of a Dubai chauffeur car — an understated, refined choice for executives.",
    highlights: [
      "Class-leading cabin quietness",
      "Mark Levinson-grade audio on select cars",
      "Soft leather seating",
      "Smooth ride over Dubai's speed humps",
    ],
    bestFor: ["Executive daily driver", "Long-distance transfers", "Discreet VIP"],
    specs: [
      { label: "Class", value: "Refined Sedan" },
      { label: "Passengers", value: "Up to 3" },
      { label: "Luggage", value: "2 large bags" },
      { label: "Transmission", value: "Automatic" },
      { label: "Cabin", value: "Premium leather" },
    ],
  },
  {
    slug: "gmc-yukon",
    name: "GMC Yukon",
    tier: "Group SUV",
    seats: 6,
    bags: 4,
    img: fleetYukon,
    short:
      "Full-size American comfort with room for the whole crew, luggage and golf bags.",
    hero: "The GMC Yukon is our go-to for larger groups — commanding presence, three rows of comfort and enough boot space for a full family holiday's worth of luggage.",
    highlights: [
      "Three rows with captain seats on select cars",
      "Massive luggage boot",
      "Great for VIP delegations & film crews",
      "Confident on long UAE highway drives",
    ],
    bestFor: ["Group airport pickup", "Corporate delegations", "Film & event crews"],
    specs: [
      { label: "Class", value: "Full-size Group SUV" },
      { label: "Passengers", value: "Up to 6" },
      { label: "Luggage", value: "4 large bags" },
      { label: "Drive", value: "4WD" },
      { label: "Cabin", value: "Leather, 3 rows" },
    ],
  },
];

export function getCar(slug: string): FleetCar | undefined {
  return fleet.find((c) => c.slug === slug);
}
