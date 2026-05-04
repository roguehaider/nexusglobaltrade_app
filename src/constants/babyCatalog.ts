/**
 * Structured baby / childcare catalogue — prices in GBP, imagery via Unsplash (stable CDN URLs).
 */

import type { Category, Product } from '../types';

export const CATEGORY_IDS = {
  formula: 'cat_formula',
  food: 'cat_food',
  snacks: 'cat_snacks',
  nappies: 'cat_nappies',
  wipes: 'cat_wipes',
} as const;

/** Curated Unsplash photo IDs — varied baby/parenting retail aesthetics */
const IMG = {
  formula: [
    '1515488047521-66551a367a0e',
    '1555252333-3609d44d1c2d',
    '1544776519-68ff69612af8',
    '1563636619-e9143da7973b',
    '1587737419356-712aa82aa42e',
    '1550583724-b2692bdaaa24',
  ],
  food: [
    '1563636619-e9143da7973b',
    '1490818380653-5883f296563b',
    '1540420773420-3366772f4999',
    '1498837167922-ddd27525d352',
    '1512621776951-a57141f2eefd',
    '1546548978-531005aa82f8',
    '1563805044746-869821e84893',
    '1615485929139-fbbc46481bf7',
  ],
  snacks: [
    '1578985505444-52f8e5e3e8e5',
    '1587049358099-e308f55bd359',
    '1558963523-b7fd715204e6',
    '1566474635946-f16deaa59dd7',
    '1514516347288-808748746035',
  ],
  nappies: [
    '1584464491033-06628f3a6b7b',
    '1515488047521-66551a367a0e',
    '1555252333-3609d44d1c2d',
    '1544776519-68ff69612af8',
    '1563296292999-cf814ec89e21',
  ],
  wipes: [
    '1583947215259-38e31be1554e',
    '1615485929139-fbbc46481bf7',
    '1563805044746-869821e84893',
    '1540555700478-4be289be603f',
    '1587737419356-712aa82aa42e',
  ],
};

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=900&q=82`;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function pickImage(cat: keyof typeof IMG, seed: string): string {
  const pool = IMG[cat];
  const id = pool[hash(seed) % pool.length];
  return unsplash(id);
}

function ratingFor(seed: string): number {
  const r = 3.5 + (hash(seed) % 151) / 100;
  return Math.min(5, Math.round(r * 10) / 10);
}

function stockFor(seed: string): number {
  return 12 + (hash(seed + 'st') % 189);
}

function priceFor(cat: keyof typeof CATEGORY_IDS, seed: string): number {
  const [lo, hi] =
    cat === 'formula'
      ? [8, 15]
      : cat === 'food'
        ? [1, 4]
        : cat === 'snacks'
          ? [2, 5]
          : cat === 'nappies'
            ? [9, 13]
            : [8, 30];
  const spanCents = Math.round((hi - lo) * 100);
  const add = hash(seed + 'gbp') % (spanCents + 1);
  return Math.round((lo + add / 100) * 100) / 100;
}

function reviewsFor(seed: string): number {
  return 40 + (hash(seed + 'rv') % 920);
}

function popularityFor(seed: string): number {
  return 55 + (hash(seed + 'pop') % 45);
}

function inferFormulaBrand(t: string): string {
  if (t.startsWith('Aptamil')) return 'Aptamil';
  if (t.startsWith('Cow & Gate')) return 'Cow & Gate';
  if (t.startsWith('SMA ')) return 'SMA';
  if (t.startsWith('Little Steps')) return 'Little Steps';
  if (t.startsWith('Kendamil')) return 'Kendamil';
  return 'SMA';
}

function tagsFor(title: string, category: string, brand: string, catKey: keyof typeof CATEGORY_IDS): string[] {
  const base = new Set<string>([
    category.toLowerCase().replace(/\s+/g, '-'),
    brand.toLowerCase().replace(/[^a-z0-9]+/gi, '-'),
    'baby',
    'nexus',
  ]);
  title
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length > 2)
    .forEach((w) => base.add(w));
  if (catKey === 'formula') base.add('infant-milk');
  if (catKey === 'nappies') base.add('diapers');
  return [...base].slice(0, 16);
}

function describe(catKey: keyof typeof CATEGORY_IDS, title: string, brand: string): string {
  switch (catKey) {
    case 'formula':
      return `${brand} nutritionally balanced formula inspired by breast milk. Suitable per stage guidance on pack; always follow preparation instructions. Trusted by parents for gentle digestion support.`;
    case 'food':
      return `Balanced baby meal: ${title}. Made with carefully selected ingredients; smooth texture suitable for weaning stages. No artificial colours in line with brand standards.`;
    case 'snacks':
      return `${title} — portioned finger food ideal for little hands. Great between meals; store sealed after opening per manufacturer advice.`;
    case 'nappies':
      return `${title} — engineered for reliable leakage protection and soft comfort. Dermatologically tested materials; size guidance on pack.`;
    case 'wipes':
      return `${title} — gentle cleansing wipes suitable for sensitive skin. Dermatologically tested; reseal pack to retain moisture.`;
    default:
      return `${title} by ${brand}. Premium nursery essential from Nexus Global Trade.`;
  }
}

type Row = { title: string; cat: keyof typeof CATEGORY_IDS; brand?: string };

/** Explicit catalogue — order matches client brief */
const ROWS: Row[] = [
  // Baby Formula
  { title: 'Aptamil Advanced First Infant Milk', cat: 'formula' },
  { title: 'Aptamil First Infant Milk', cat: 'formula' },
  { title: 'Aptamil Follow On Milk', cat: 'formula' },
  { title: 'Aptamil Advanced Second Infant Milk', cat: 'formula' },
  { title: 'Aptamil Advanced Toddler Milk', cat: 'formula' },
  { title: 'Aptamil Toddler Milk', cat: 'formula' },
  { title: 'Cow & Gate First Infant Milk', cat: 'formula' },
  { title: 'Cow & Gate Follow-on Milk', cat: 'formula' },
  { title: 'Cow & Gate Toddler Milk', cat: 'formula' },
  { title: 'SMA Advanced First Infant Milk', cat: 'formula' },
  { title: 'SMA PRO First Infant Milk', cat: 'formula' },
  { title: 'SMA Advanced Follow-on Milk', cat: 'formula' },
  { title: 'SMA PRO Follow-on Milk', cat: 'formula' },
  { title: 'SMA Anti Reflux Milk', cat: 'formula' },
  { title: 'Little Steps First Infant Milk', cat: 'formula' },
  { title: 'Little Steps Follow-on Milk', cat: 'formula' },
  { title: 'SMA Gold Prem 2', cat: 'formula' },
  { title: 'SMA Pro Growing Up Milk', cat: 'formula' },
  { title: 'Little Steps Growing Up Milk', cat: 'formula' },
  { title: 'Kendamil Organic First Infant Milk', cat: 'formula' },
  { title: 'Kendamil Classic First Infant Milk', cat: 'formula' },
  { title: 'Kendamil Goat First Infant Milk', cat: 'formula' },
  { title: 'Kendamil Comfort Milk', cat: 'formula' },
  { title: 'Kendamil Classic Follow-on Milk', cat: 'formula' },
  { title: 'Kendamil Organic Follow-on Milk', cat: 'formula' },
  { title: 'Kendamil Goat Follow-on Milk', cat: 'formula' },
  { title: 'Kendamil Classic Toddler Milk', cat: 'formula' },
  { title: 'Kendamil Goat Toddler Milk', cat: 'formula' },
  { title: 'Kendamil Organic Toddler Milk', cat: 'formula' },

  // Baby Food
  { title: 'Pumpkin Rice', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Pear, Carrot, Prune and Beetroot Baby Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Forest Fruits Smoothie', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Cauliflower', cat: 'food', brand: 'Nature\'s Pick' },
  { title: 'Green Peas', cat: 'food', brand: 'Nature\'s Pick' },
  { title: 'Banana, Apple, Strawberry and Kiwi Baby Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Apple, Pear, Banana and Apricot Baby Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Apple, Mango, Orange and Carrot Baby Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Apple and Banana Baby Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Creamed Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Multigrain Banana Berry Cereal', cat: 'food', brand: 'Morning Baby' },
  { title: 'Multigrain Cereal', cat: 'food', brand: 'Morning Baby' },
  { title: 'Organic Rice', cat: 'food', brand: 'Nature\'s Pick' },
  { title: 'Creamed Porridge Breakfast', cat: 'food', brand: 'Morning Baby' },
  { title: 'Cheesy Potato and Spinach Bake', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Mango and Banana topped with Yoghurt', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Banana Yogurt Breakfast', cat: 'food', brand: 'Morning Baby' },
  { title: 'Carrots, Peas & Cauliflower', cat: 'food', brand: 'Nature\'s Pick' },
  { title: 'Vegetable Lasagne', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Rice Pudding with Apple & Pear', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Spaghetti with Tomatoes & Mozzarella', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Veg & Mozzarella Potato Bake', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Macaroni Cheese with Carrots & Peas', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Carrots and Peas', cat: 'food', brand: 'Nature\'s Pick' },
  { title: 'Vegetable Cannelloni', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Banana and Plum Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Creamy Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Apple & Banana Crumble', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Banana & Blueberry Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Cheese and Tomato Pasta Stars', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Strawberry, Banana, Raspberry & Apple Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Peach, Mango, Banana & Apple Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Blueberry, Coconut & Oat', cat: 'food', brand: 'Morning Baby' },
  { title: 'Apple and Mango Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Creamed Porridge (Classic Recipe)', cat: 'food', brand: 'Morning Baby' },
  { title: 'Strawberry & Yoghurt Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Apple Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Pear Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Potato Bake with Green Beans and Peas', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Cauliflower, Broccoli & Cheese Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Pear, Raspberry & Yoghurt', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Risotto with Chickpeas & Pumpkin', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Saucy Pasta Stars with Beans & Carrots', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Blueberry Multigrain Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Banana Oat Porridge', cat: 'food', brand: 'Morning Baby' },
  { title: 'Apple, Banana & Watermelon Pouch', cat: 'food', brand: 'Little Gourmet' },
  { title: 'Cheesy Tomato Pasta', cat: 'food', brand: 'Little Gourmet' },

  // Baby Snacks
  { title: 'Farley’s Original Baby Rusks', cat: 'snacks', brand: 'Farley\'s' },
  { title: 'Farley’s Reduced Sugar Baby Rusks', cat: 'snacks', brand: 'Farley\'s' },
  { title: 'Apple Biscotti Snack', cat: 'snacks', brand: 'Little Bites' },
  { title: 'Chocolate Biscotti Snack', cat: 'snacks', brand: 'Little Bites' },
  { title: 'Banana Biscotti', cat: 'snacks', brand: 'Little Bites' },
  { title: 'Egg Custard Jar', cat: 'snacks', brand: 'Little Gourmet' },

  // Baby Nappies
  { title: 'Pampers Premium Protection Taped - Newborn', cat: 'nappies', brand: 'Pampers' },
  { title: 'Pampers Premium Protection Taped', cat: 'nappies', brand: 'Pampers' },
  { title: 'Pampers Baby Dry 12hr Protection', cat: 'nappies', brand: 'Pampers' },
  { title: 'Pampers Harmonie Eco-Friendly', cat: 'nappies', brand: 'Pampers' },
  { title: 'Pampers Preemie Protection', cat: 'nappies', brand: 'Pampers' },
  { title: 'Pampers Ninjamas', cat: 'nappies', brand: 'Pampers' },
  { title: 'DryNites Pyjama Pants for Girls Age 3-4', cat: 'nappies', brand: 'DryNites' },
  { title: 'DryNites Pyjama Pants for Boys Age 3-4', cat: 'nappies', brand: 'DryNites' },
  { title: 'DryNites Pyjama Pants for Girls Age 4-7', cat: 'nappies', brand: 'DryNites' },
  { title: 'DryNites Pyjama Pants for Boys Age 4-7', cat: 'nappies', brand: 'DryNites' },
  { title: 'DryNites Pyjama Pants for Girls Age 8-13', cat: 'nappies', brand: 'DryNites' },
  { title: 'DryNites Pyjama Pants for Boys Age 8-13', cat: 'nappies', brand: 'DryNites' },

  // Baby Wipes
  { title: 'WaterWipes Baby Wipes', cat: 'wipes', brand: 'WaterWipes' },
  { title: 'Huggies Natural Care Plastic Free Baby Wipes', cat: 'wipes', brand: 'Huggies' },
  { title: 'Pampers Harmonie Aqua Baby Wipes', cat: 'wipes', brand: 'Pampers' },
  { title: 'Pampers Sensitive Baby Wipes', cat: 'wipes', brand: 'Pampers' },
  { title: 'Huggies Extra Care Sensitive Baby Wipes', cat: 'wipes', brand: 'Huggies' },
  { title: 'Pampers Aqua Pure Baby Wipes', cat: 'wipes', brand: 'Pampers' },
];

const CATEGORY_LABEL: Record<keyof typeof CATEGORY_IDS, string> = {
  formula: 'Baby Formula',
  food: 'Baby Food',
  snacks: 'Baby Snacks',
  nappies: 'Baby Nappies',
  wipes: 'Baby Wipes',
};

export function buildBabyProducts(): Product[] {
  const counts: Record<string, number> = {};
  return ROWS.map((row, index) => {
    const catKey = row.cat;
    const categoryId = CATEGORY_IDS[catKey];
    const category = CATEGORY_LABEL[catKey];
    const slugBase = row.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    counts[slugBase] = (counts[slugBase] ?? 0) + 1;
    const id =
      counts[slugBase] > 1 ? `${slugBase}-${counts[slugBase]}` : slugBase || `sku-${index}`;

    const brand =
      row.brand ??
      (catKey === 'formula' ? inferFormulaBrand(row.title) : 'Little Gourmet');

    const seed = `${id}-${index}`;
    const image = pickImage(catKey, seed);
    const price = priceFor(catKey, seed);
    const stock = stockFor(seed);
    const rating = ratingFor(seed);
    const tags = tagsFor(row.title, category, brand, catKey);

    const product: Product = {
      id,
      title: row.title,
      brand,
      price,
      rating,
      reviewCount: reviewsFor(seed),
      category,
      categoryId,
      image,
      images: [image],
      description: describe(catKey, row.title, brand),
      stock,
      inStock: stock > 0,
      popularity: popularityFor(seed),
      tags,
    };

    return product;
  });
}

export function buildCategories(): Category[] {
  return [
    {
      id: CATEGORY_IDS.formula,
      name: CATEGORY_LABEL.formula,
      image: unsplash(IMG.formula[0]),
    },
    {
      id: CATEGORY_IDS.food,
      name: CATEGORY_LABEL.food,
      image: unsplash(IMG.food[0]),
    },
    {
      id: CATEGORY_IDS.snacks,
      name: CATEGORY_LABEL.snacks,
      image: unsplash(IMG.snacks[0]),
    },
    {
      id: CATEGORY_IDS.nappies,
      name: CATEGORY_LABEL.nappies,
      image: unsplash(IMG.nappies[0]),
    },
    {
      id: CATEGORY_IDS.wipes,
      name: CATEGORY_LABEL.wipes,
      image: unsplash(IMG.wipes[0]),
    },
  ];
}
