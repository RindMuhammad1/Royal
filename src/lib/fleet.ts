import fleetCivic from "@/assets/fleet-civic.jpg";
import fleetBmw from "@/assets/fleet-bmw.jpg";
import fleetMercedes from "@/assets/fleet-mercedes.jpg";
import fleetPatrol from "@/assets/fleet-patrol.jpg";
import fleetLexus from "@/assets/fleet-lexus.jpg";
import fleetYukon from "@/assets/fleet-yukon.jpg";
import fleetSienna from "@/assets/fleet-sienna.jpg";
import fleetSedona from "@/assets/fleet-sedona.jpg";
import fleetHiace from "@/assets/fleet-hiace.jpg";
import fleetSportage from "@/assets/fleet-sportage.jpg";

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
  {
    slug: "toyota-sienna",
    name: "Toyota Sienna",
    tier: "7-Seater Van",
    seats: 7,
    bags: 4,
    img: fleetSienna,
    short:
      "A 7-seater van with sliding doors and a flat, quiet cabin — made for families and small groups.",
    hero: "The Toyota Sienna is the easiest way to move seven people around Dubai. Sliding doors, a low step-in for kids and elders, and a boot that still swallows the airport luggage.",
    highlights: [
      "7 seats with easy sliding-door access",
      "Rear AC vents for every row",
      "Smooth, car-like ride quality",
      "Great for family airport runs",
    ],
    bestFor: ["Family airport transfers", "School & group runs", "Full-day family days out"],
    specs: [
      { label: "Class", value: "7-Seater Van" },
      { label: "Passengers", value: "Up to 7" },
      { label: "Luggage", value: "4 large bags" },
      { label: "Doors", value: "Power sliding" },
      { label: "AC", value: "Tri-zone climate" },
    ],
  },
  {
    slug: "kia-sedona",
    name: "Kia Sedona",
    tier: "7-Seater Van",
    seats: 7,
    bags: 4,
    img: fleetSedona,
    short:
      "Comfortable 7-seater MPV with generous legroom and a big boot for hotel and airport runs.",
    hero: "The Kia Sedona is our value 7-seater — plenty of legroom in all three rows, a wide boot and a smooth highway ride for out-of-Dubai trips.",
    highlights: [
      "Three rows of adult-size seating",
      "Wide boot for group luggage",
      "Sliding doors for kerbside pickup",
      "Comfortable on long UAE drives",
    ],
    bestFor: ["Group transfers", "Hotel pickups", "Day trips to Abu Dhabi or RAK"],
    specs: [
      { label: "Class", value: "7-Seater MPV" },
      { label: "Passengers", value: "Up to 7" },
      { label: "Luggage", value: "4 large bags" },
      { label: "Doors", value: "Sliding rear doors" },
      { label: "AC", value: "Dual-zone + rear vents" },
    ],
  },
  {
    slug: "toyota-hiace",
    name: "Toyota Hi Ace",
    tier: "Group Van",
    seats: 11,
    bags: 8,
    img: fleetHiace,
    short:
      "High-roof passenger van for larger groups, staff transport and heavy luggage loads.",
    hero: "The Toyota Hi Ace is built for numbers — a tall, airy cabin, rows of proper seats and space for everyone's bags. The practical choice for staff transport, events and large family groups.",
    highlights: [
      "Room for large groups in one vehicle",
      "High roof, easy walk-in access",
      "Powerful AC throughout the cabin",
      "Huge luggage capacity",
    ],
    bestFor: ["Staff & crew transport", "Large group airport runs", "Events & conferences"],
    specs: [
      { label: "Class", value: "Group Passenger Van" },
      { label: "Passengers", value: "Up to 11" },
      { label: "Luggage", value: "8+ bags" },
      { label: "Access", value: "Sliding side door" },
      { label: "AC", value: "Full-cabin cooling" },
    ],
  },
  {
    slug: "kia-sportage",
    name: "Kia Sportage",
    tier: "Compact SUV",
    seats: 4,
    bags: 3,
    img: fleetSportage,
    short:
      "A modern compact SUV — higher seating, easy parking and a smart look for city driving.",
    hero: "The Kia Sportage gives you SUV seating height without the bulk. A comfortable, modern cabin for city errands, meetings and short intercity drives.",
    highlights: [
      "Raised seating for a better view",
      "Modern touchscreen and connectivity",
      "Easy to park at malls and towers",
      "Efficient on daily Dubai driving",
    ],
    bestFor: ["Daily city driving", "Airport transfers (1–3 pax)", "Half-day bookings"],
    specs: [
      { label: "Class", value: "Compact SUV" },
      { label: "Passengers", value: "Up to 4" },
      { label: "Luggage", value: "3 large bags" },
      { label: "Transmission", value: "Automatic" },
      { label: "Cabin", value: "Leather-trim seating" },
    ],
  },
];

export function getCar(slug: string): FleetCar | undefined {
  return fleet.find((c) => c.slug === slug);
}
