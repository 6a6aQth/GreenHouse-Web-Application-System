import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const products: Prisma.ProductCreateManyInput[] = [
  {
    id: 1,
    category: "tunnels",
    name: "TTV8 Fixed Vent",
    description: "High tunnel up to 3.5m, span 8m, distance between arch 2m or 3m, minimum length 8m, vent 1.15m, loading capacity 25kg/sqm",
    image: "/TTV8 Fixed Vent Tunnel.jpg",
    tags: ["3.5m high", "8m span", "2m/3m arch", "8m+ length", "1.15m vent", "25kg/sqm"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 2,
    category: "tunnels",
    name: "TT8",
    description: "High tunnel up to 3.5m, span 8m, distance between arch 2m or 3m, minimum length 8m, vent 1.15m, loading capacity 25kg/sqm",
    image: "/TT8 Tunnel.jpg",
    tags: ["3.5m high", "8m span", "2m/3m arch", "8m+ length", "1.15m vent", "25kg/sqm"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 3,
    category: "tunnels",
    name: "TT10",
    description: "High tunnel up to 3.5m, span 10m, distance between arch 2m or 3m, minimum length, loading capacity 25kg/sqm",
    image: "/TT10  Tunnel.jpg",
    tags: ["3.5m high", "10m span", "2m/3m arch", "25kg/sqm"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 4,
    category: "nethouses",
    name: "NH4",
    description: "Pole spacing 4m, height 3m, without trellising",
    image: "/NH4 Nethouse.webp",
    tags: ["4m pole spacing", "3m height", "No trellising", "UV resistant", "Easy assembly", "Wind resistant", "Durable frame"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 5,
    category: "nethouses",
    name: "NH4T",
    description: "Pole spacing 4m, height 3m, trellising",
    image: "/NH4T Nethouse.jpg",
    tags: ["4m pole spacing", "3m height", "Trellising", "High yield", "Pest control", "Easy maintenance", "Long lifespan"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 6,
    category: "irrigation",
    name: "Irrigation",
    description: "Design, supply and installation of irrigation systems ranging from manual to fully automatic systems. Includes drip systems, filters, dosing equipment",
    image: "/Irrigation.jpg",
    tags: ["Manual/Automatic", "Drip systems", "Filters", "Dosing equipment"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 7,
    category: "accessories",
    name: "Matching Plastic",
    description: "Black and White",
    image: "/Matching Plastic.webp",
    tags: ["Black & White", "UV stabilized", "Tear resistant", "Flexible", "Multi-season", "Custom sizes", "Lightweight"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 8,
    category: "accessories",
    name: "Greenhouse Covering Plastic",
    description: "9m by 35m roll",
    image: "/GreenHouse Covering Plastic.jpg",
    tags: ["9m x 35m roll", "UV protection", "High clarity", "Anti-drip", "Long-lasting", "Weatherproof", "Easy install"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 9,
    category: "accessories",
    name: "Greenhouse Covering Mesh Net",
    description: "50% mesh, 2.5m by 35m roll",
    image: "/greenhouse covering mesh net.webp",
    tags: ["50% mesh", "2.5m x 35m roll", "Pest barrier", "Breathable", "Light diffusion", "Strong weave", "Reusable"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 10,
    category: "accessories",
    name: "Shednets",
    description: "40% to 80% shed net",
    image: "/Shednets.jpg",
    tags: ["40%-80% shade", "UV stabilized", "Flexible", "Easy to cut", "Multi-purpose", "Weather resistant", "Affordable"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 11,
    category: "accessories",
    name: "Crop Support",
    description: "Supply of crop support systems including clips, hooks, twine, truss arches, cluster support",
    image: "/Crop Support.jpg",
    tags: ["Clips", "Hooks", "Twine", "Truss arches", "Cluster support"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 12,
    category: "greenhouses",
    name: "TG8 Fixed Vent Greenhouse",
    description: "8m span, 7m height, 2-4m arch spacing, 25kg/sqm load capacity",
    image: "/TG8 Fixed Vent Greenhouse.jpg",
    tags: ["8m span", "7m height", "2-4m arch", "25kg/sqm load"],
    price: new Prisma.Decimal(0),
  },
  {
    id: 13,
    category: "greenhouses",
    name: "TG10 Fixed Vent Greenhouse",
    description: "10m span greenhouse with same specifications as TG8",
    image: "/TG10 Fixed Vent Greenhouse.webp",
    tags: ["10m span", "7m height", "2-4m arch", "25kg/sqm load"],
    price: new Prisma.Decimal(0),
  },
]

async function main() {
  await prisma.product.createMany({ data: products, skipDuplicates: true })
  console.log('Seeded products!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 